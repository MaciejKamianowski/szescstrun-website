import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pl } from '@payloadcms/translations/languages/pl'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { PricingPlans } from './collections/PricingPlans'
import { LessonOffers } from './collections/LessonOffers'
import { Videos } from './collections/Videos'
import { Testimonials } from './collections/Testimonials'
import { Pages } from './collections/Pages'
import { Downloads } from './collections/Downloads'
import { SiteSettings } from './globals/SiteSettings'
import { buildPublicMediaUrl, resolveObjectStorageConfig } from './lib/storage'
import { getServerUrl } from './lib/utils'
import { MAX_DOWNLOAD_BYTES } from './lib/uploads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const storage = resolveObjectStorageConfig()

if (storage.configMessage) {
  // Clear startup guidance — never emit S3 API endpoints as browser media URLs.
  console.info(storage.configMessage)
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Sześć Strun',
      robots: 'noindex, nofollow',
    },
  },
  i18n: {
    supportedLanguages: { pl },
    fallbackLanguage: 'pl',
  },
  collections: [Users, Media, Posts, Videos, Testimonials, LessonOffers, PricingPlans, Downloads, Pages],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev: push schema. Production: run `pnpm payload migrate` explicitly before start
    // (avoid auto prodMigrations — interactive prompts can hang `next build`).
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  upload: {
    abortOnLimit: true,
    responseOnLimit:
      'Plik jest zbyt duży. Zdjęcia mogą mieć do 12 MB, a materiały do pobrania do 25 MB.',
    limits: {
      fileSize: MAX_DOWNLOAD_BYTES,
    },
  },
  plugins: [
    s3Storage({
      enabled: storage.enabled,
      // Keep prefix/_objectKey in DB schema even when R2 is disabled locally,
      // so migrations stay consistent across environments.
      alwaysInsertFields: true,
      // When enabled, plugin disables local disk for Media (Railway ephemeral FS safe).
      disableLocalStorage: true,
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename: fileName, prefix }) =>
            buildPublicMediaUrl(storage, fileName, typeof prefix === 'string' ? prefix : 'media'),
        },
        downloads: {
          prefix: 'downloads',
          generateFileURL: ({ filename: fileName, prefix }) =>
            buildPublicMediaUrl(
              storage,
              fileName,
              typeof prefix === 'string' ? prefix : 'downloads',
              getServerUrl(),
              'downloads',
            ),
        },
      },
      bucket: storage.bucket || 'szescstrun-media',
      config: {
        credentials: {
          accessKeyId: storage.accessKeyId || 'local-placeholder',
          secretAccessKey: storage.secretAccessKey || 'local-placeholder',
        },
        region: storage.region,
        endpoint: storage.endpoint || undefined,
        forcePathStyle: storage.forcePathStyle,
      },
    }),
  ],
})
