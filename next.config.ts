import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

type ImageRemotePattern = {
  protocol?: 'http' | 'https'
  hostname: string
  pathname?: string
}

function mediaRemotePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [
    { protocol: 'https', hostname: 'i.ytimg.com' },
    { protocol: 'https', hostname: '**.r2.dev' },
  ]

  const publicUrl = process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL
  if (publicUrl) {
    try {
      const parsed = new URL(publicUrl)
      const protocol = parsed.protocol.replace(':', '') as 'http' | 'https'
      if (protocol === 'http' || protocol === 'https') {
        patterns.push({
          protocol,
          hostname: parsed.hostname,
          pathname: '/**',
        })
      }
    } catch {
      // ignore invalid public URL at build time
    }
  }

  return patterns
}

const nextConfig: NextConfig = {
  // Required by Dockerfile runner stage (Next standalone output)
  output: 'standalone',
  images: {
    // Payload proxy files are served by this app. Pass them to next/image as
    // paths (`/api/media/file/...`). Absolute same-origin URLs are remote and
    // return 400 ("url" parameter is not allowed) — this host is not listed below.
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/icons/**',
      },
    ],
    // Do NOT allow *.r2.cloudflarestorage.com — that is the private S3 API endpoint.
    remotePatterns: mediaRemotePatterns(),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
