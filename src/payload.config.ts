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
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Enabled = Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT)

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
  collections: [Users, Media, Posts, PricingPlans, LessonOffers, Videos, Testimonials, Pages],
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
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename: fileName, prefix }) => {
            const key = prefix ? `${prefix}/${fileName}` : fileName
            const publicUrl = process.env.S3_PUBLIC_URL
            if (publicUrl) return `${publicUrl.replace(/\/$/, '')}/${key}`
            return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${fileName}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
      },
    }),
  ],
})
