/** Editorial SEO defaults for public routes. CMS values override when non-empty. */

export const DEFAULT_OG_IMAGE_PATH = '/images/szesc-strun-logo.jpeg'

export const SEO_DEFAULTS = {
  home: {
    title: 'Sześć Strun – Lekcje gitary akustycznej | Jacek Krakowski',
    description:
      'Sześć Strun to indywidualne lekcje gitary akustycznej prowadzone przez Jacka Krakowskiego. Poznaj ofertę, rozwijaj umiejętności i umów lekcję.',
  },
  about: {
    title: 'Jacek Krakowski – Nauczyciel gry na gitarze | Sześć Strun',
    description:
      'Poznaj Jacka Krakowskiego, nauczyciela gry na gitarze akustycznej i twórcę Sześciu Strun. Dowiedz się więcej o jego podejściu do nauczania.',
  },
  offer: {
    title: 'Lekcje gitary akustycznej – Oferta | Sześć Strun',
    description:
      'Poznaj ofertę indywidualnych lekcji gitary akustycznej w Sześciu Strunach. Sprawdź dostępne zajęcia i dowiedz się, jak rozpocząć naukę.',
  },
  pricing: {
    title: 'Cennik lekcji gitary akustycznej | Sześć Strun',
    description:
      'Sprawdź aktualny cennik lekcji gitary akustycznej w Sześciu Strunach. Poznaj dostępne opcje zajęć i wybierz odpowiednią dla siebie.',
  },
  news: {
    title: 'Aktualności | Sześć Strun – Lekcje gitary',
    description:
      'Sprawdź aktualności Sześciu Strun, informacje o zajęciach, wydarzeniach i nauce gry na gitarze akustycznej.',
  },
  recordings: {
    title: 'Nagrania gitarowe | Sześć Strun',
    description:
      'Posłuchaj nagrań udostępnionych przez Sześć Strun i poznaj muzyczną działalność Jacka Krakowskiego.',
  },
  contact: {
    title: 'Kontakt i zapisy na lekcje gitary | Sześć Strun',
    description:
      'Skontaktuj się z Jackiem Krakowskim i zapytaj o indywidualne lekcje gitary akustycznej w Sześciu Strunach. Wyślij wiadomość przez formularz.',
  },
  privacy: {
    title: 'Polityka prywatności | Sześć Strun',
    description: 'Polityka prywatności serwisu Sześć Strun (szescstrun.pl).',
  },
  downloads: {
    title: 'Materiały do pobrania | Sześć Strun',
    description:
      'Materiały do pobrania przygotowane przez Sześć Strun — lekcje gitary akustycznej Jacka Krakowskiego.',
  },
} as const

export function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return undefined
}
