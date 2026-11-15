import { getServerUrl } from '@/lib/utils'

/**
 * Cloudflare R2 / S3-compatible storage configuration for Payload.
 *
 * Prefer R2_* env vars (Railway). S3_* remain as backwards-compatible aliases.
 * Never expose access keys to the browser. Never use the S3 API endpoint as a
 * public media URL — use R2_PUBLIC_URL (CDN / r2.dev) or the Payload proxy.
 */

export type ObjectStorageConfig = {
  enabled: boolean
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  region: string
  forcePathStyle: boolean
  /** Public CDN / r2.dev base URL (no trailing slash). Null = use Payload proxy. */
  publicBaseUrl: string | null
  /** How browser-facing media URLs are produced. */
  publicReadMode: 'cdn' | 'proxy' | 'disabled'
  /** Human-readable setup guidance when CDN is missing. */
  configMessage: string | null
}

function read(env: NodeJS.ProcessEnv, ...keys: string[]): string {
  for (const key of keys) {
    const value = env[key]?.trim()
    if (value) return value
  }
  return ''
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '')
}

function isApiEndpoint(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return host.endsWith('.r2.cloudflarestorage.com') || host.includes('amazonaws.com')
  } catch {
    return false
  }
}

/**
 * Resolve object storage settings from the environment.
 * Safe to call at config load time (no network I/O).
 */
export function resolveObjectStorageConfig(
  env: NodeJS.ProcessEnv = process.env,
): ObjectStorageConfig {
  const bucket = read(env, 'R2_BUCKET', 'S3_BUCKET')
  const accessKeyId = read(env, 'R2_ACCESS_KEY_ID', 'S3_ACCESS_KEY_ID')
  const secretAccessKey = read(env, 'R2_SECRET_ACCESS_KEY', 'S3_SECRET_ACCESS_KEY')
  const endpoint = read(env, 'R2_ENDPOINT', 'S3_ENDPOINT')
  const region = read(env, 'R2_REGION', 'S3_REGION') || 'auto'
  const forcePathStyle = read(env, 'R2_FORCE_PATH_STYLE', 'S3_FORCE_PATH_STYLE') !== 'false'
  const publicRaw = read(env, 'R2_PUBLIC_URL', 'S3_PUBLIC_URL')

  const enabled = Boolean(bucket && accessKeyId && secretAccessKey && endpoint)

  if (!enabled) {
    return {
      enabled: false,
      bucket: '',
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: '',
      region,
      forcePathStyle,
      publicBaseUrl: null,
      publicReadMode: 'disabled',
      configMessage:
        'Object storage disabled — using local Media upload dir. On Railway set R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT (and ideally R2_PUBLIC_URL).',
    }
  }

  let publicBaseUrl: string | null = null
  let publicReadMode: ObjectStorageConfig['publicReadMode'] = 'proxy'
  let configMessage: string | null = null

  if (publicRaw) {
    if (isApiEndpoint(publicRaw)) {
      throw new Error(
        '[storage] R2_PUBLIC_URL/S3_PUBLIC_URL must be a public CDN or r2.dev URL, not the S3 API endpoint (*.r2.cloudflarestorage.com).',
      )
    }
    publicBaseUrl = normalizeBaseUrl(publicRaw)
    publicReadMode = 'cdn'
  } else {
    publicReadMode = 'proxy'
    configMessage =
      '[storage] R2 is enabled without R2_PUBLIC_URL. Browser media URLs will use the Payload proxy (/api/media/file/…). For production CDN performance set R2_PUBLIC_URL to a public r2.dev or custom media domain — never the API endpoint.'
  }

  return {
    enabled: true,
    bucket,
    accessKeyId,
    secretAccessKey,
    endpoint,
    region,
    forcePathStyle,
    publicBaseUrl,
    publicReadMode,
    configMessage,
  }
}

/** Build a browser-facing URL for an object stored under the media prefix. */
export function buildPublicMediaUrl(
  storage: ObjectStorageConfig,
  filename: string,
  prefix = 'media',
  serverUrl = getServerUrl(),
): string {
  const key = prefix ? `${prefix.replace(/\/$/, '')}/${filename}` : filename

  if (storage.publicReadMode === 'cdn' && storage.publicBaseUrl) {
    return `${storage.publicBaseUrl}/${key}`
  }

  // Secure proxy: Payload serves the file using server-side credentials.
  const server = serverUrl.replace(/\/$/, '')
  if (!server) return `/api/media/file/${filename}`
  return `${server}/api/media/file/${filename}`
}

export function getPublicMediaHostname(storage: ObjectStorageConfig): string | null {
  if (!storage.publicBaseUrl) return null
  try {
    return new URL(storage.publicBaseUrl).hostname
  } catch {
    return null
  }
}
