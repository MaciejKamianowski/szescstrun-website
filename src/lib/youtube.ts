const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const trimmed = url.trim()

    if (YOUTUBE_ID_REGEX.test(trimmed)) {
      return trimmed
    }

    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id && YOUTUBE_ID_REGEX.test(id) ? id : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v')
        return id && YOUTUBE_ID_REGEX.test(id) ? id : null
      }

      const parts = parsed.pathname.split('/').filter(Boolean)
      if (
        (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') &&
        parts[1] &&
        YOUTUBE_ID_REGEX.test(parts[1])
      ) {
        return parts[1]
      }
    }

    return null
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}
