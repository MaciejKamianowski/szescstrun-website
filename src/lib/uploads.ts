export const MAX_IMAGE_BYTES = 12 * 1024 * 1024

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const

const IMAGE_MIME_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
}

export const IMAGE_FORMAT_LABEL = 'JPG, JPEG, PNG, WebP, AVIF i GIF'
export const IMAGE_SIZE_LABEL = '12 MB'

export type UploadFileInfo = {
  mimetype?: string | null
  size?: number | null
  name?: string | null
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function normalizeMime(mime: string | null | undefined, name?: string | null): string {
  const raw = mime?.trim().toLowerCase() || ''
  if (IMAGE_MIME_ALIASES[raw]) return IMAGE_MIME_ALIASES[raw]
  if (raw) return raw

  const extension = name?.toLowerCase().split('.').pop()
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
  if (extension === 'png') return 'image/png'
  if (extension === 'webp') return 'image/webp'
  if (extension === 'avif') return 'image/avif'
  if (extension === 'gif') return 'image/gif'
  if (extension === 'heic' || extension === 'heif') return 'image/heic'
  return ''
}

/** Polish validation message, or null when the image can be stored. */
export function validateImageUpload(file: UploadFileInfo): string | null {
  const mime = normalizeMime(file.mimetype, file.name)

  if (mime === 'image/heic' || mime === 'image/heif') {
    return 'Zdjęcia w formacie HEIC (często z iPhone’a) nie są obsługiwane. Zapisz zdjęcie jako JPG albo PNG i prześlij je ponownie.'
  }

  if (!IMAGE_MIME_TYPES.includes(mime as (typeof IMAGE_MIME_TYPES)[number])) {
    const found = mime || 'nieznany'
    return `Niedozwolony format pliku (${found}). Dozwolone formaty: ${IMAGE_FORMAT_LABEL}. Maksymalny rozmiar: ${IMAGE_SIZE_LABEL}.`
  }

  if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
    return `Plik jest zbyt duży (${formatBytes(file.size)}). Maksymalny rozmiar zdjęcia to ${IMAGE_SIZE_LABEL}. Dozwolone formaty: ${IMAGE_FORMAT_LABEL}.`
  }

  return null
}

export const DOWNLOAD_MIME_TYPES = [
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024

export function validateDownloadUpload(file: UploadFileInfo): string | null {
  const mime = file.mimetype?.trim().toLowerCase() || ''
  if (!DOWNLOAD_MIME_TYPES.includes(mime as (typeof DOWNLOAD_MIME_TYPES)[number])) {
    return 'Niedozwolony format pliku. Dozwolone są PDF, ZIP, DOC, DOCX, MP3, WAV oraz zdjęcia JPG, PNG i WebP.'
  }
  if (typeof file.size === 'number' && file.size > MAX_DOWNLOAD_BYTES) {
    return `Plik jest zbyt duży (${formatBytes(file.size)}). Maksymalny rozmiar materiału to 25 MB.`
  }
  return null
}
