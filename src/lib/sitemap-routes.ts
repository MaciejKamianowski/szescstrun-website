/** Public marketing routes — never include /admin or /api. */
export const SITEMAP_STATIC_PATHS = [
  '',
  '/o-mnie',
  '/oferta',
  '/cennik',
  '/aktualnosci',
  '/nagrania',
  '/do-pobrania',
  '/kontakt',
  '/polityka-prywatnosci',
] as const
