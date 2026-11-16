import type { Media, SiteSetting } from '@/payload-types'
import { resolveRenderableMedia, type RenderableMedia } from '@/lib/media'
import { SEO_DEFAULTS, firstNonEmpty } from '@/lib/seo-defaults'

export type LinkType = 'internal' | 'external'

export type NavItemInput = {
  id?: string | null
  label?: string | null
  linkType?: LinkType | null
  internalPath?: string | null
  externalUrl?: string | null
  openInNewTab?: boolean | null
  active?: boolean | null
}

export type ResolvedLink = {
  id: string
  label: string
  href: string
  openInNewTab: boolean
  external: boolean
}

export type WhyPointInput = {
  id?: string | null
  title?: string | null
  text?: string | null
  active?: boolean | null
}

export type ResolvedWhyPoint = {
  id: string
  title: string
  text: string
  number: string
}

export type RichTextValue = SiteSetting['teacherBiography']

export type AboutSectionInput = {
  id?: string | null
  heading?: string | null
  body?: RichTextValue
  active?: boolean | null
}

export type ContentButtonInput = NavItemInput

type ContentImage = Media | number | null | undefined

/**
 * Loose view of site settings. New CMS fields are optional so the public site
 * keeps its current copy until they are saved, without overwriting later edits.
 */
export type SiteContentSettings = {
  teacherName?: string | null
  heroCTA?: string | null
  siteDescription?: string | null
  footerNote?: string | null
  navigation?: NavItemInput[] | null
  navCta?: NavItemInput | null
  showAboutPreview?: boolean | null
  aboutPreviewEyebrow?: string | null
  aboutPreviewTitle?: string | null
  aboutPreviewLead?: string | null
  aboutPreviewText?: string | null
  aboutPreviewButtonLabel?: string | null
  aboutPreviewButtonHref?: string | null
  aboutPreviewImage?: ContentImage
  showWhySection?: boolean | null
  whyEyebrow?: string | null
  whyTitle?: string | null
  whyDescription?: string | null
  whyPoints?: WhyPointInput[] | null
  showRecordingsSection?: boolean | null
  recordingsEyebrow?: string | null
  recordingsTitle?: string | null
  recordingsDescription?: string | null
  recordingsButtonLabel?: string | null
  recordingsButtonHref?: string | null
  recordingsEmptyBehavior?: 'hide' | 'message' | null
  recordingsEmptyMessage?: string | null
  recordingsPageTitle?: string | null
  recordingsPageIntro?: string | null
  aboutEyebrow?: string | null
  aboutHeading?: string | null
  aboutIntro?: string | null
  teacherBiography?: RichTextValue
  teacherExperienceHeading?: string | null
  teacherExperience?: RichTextValue
  teacherMethodHeading?: string | null
  teacherMethod?: RichTextValue
  aboutPhoto?: ContentImage
  aboutGallery?: Array<{
    id?: string | null
    image?: ContentImage
    caption?: string | null
    active?: boolean | null
  }> | null
  aboutSections?: AboutSectionInput[] | null
  aboutButtons?: ContentButtonInput[] | null
  aboutSeoTitle?: string | null
  aboutSeoDescription?: string | null
  downloadsEyebrow?: string | null
  downloadsTitle?: string | null
  downloadsDescription?: string | null
  downloadsEmptyMessage?: string | null
  downloadsSeoTitle?: string | null
  downloadsSeoDescription?: string | null
}

export const ABOUT_PREVIEW_EYEBROW = 'O nauczycielu'
export const ABOUT_PREVIEW_TITLE = 'Jacek Krakowski'
export const ABOUT_PREVIEW_LEAD =
  'Indywidualne podejście, spokojna praca nad brzmieniem i techniką oraz nauka dopasowana do Twojego tempa.'
export const ABOUT_PREVIEW_TEXT =
  'Sześć Strun to przestrzeń do nauki gry na gitarze akustycznej — od pierwszych akordów po bardziej świadomą pracę nad stylem i repertuarem. Szczegółowe informacje o doświadczeniu i metodzie nauczania znajdziesz na stronie nauczyciela.'
export const ABOUT_PREVIEW_BUTTON = 'Poznaj Jacka'

export const WHY_EYEBROW = 'Metoda'
export const WHY_TITLE = 'Dlaczego warto'
export const WHY_DESCRIPTION =
  'Spokojna, konkretna nauka bez niezweryfikowanych obietnic — z naciskiem na regularność i zrozumienie instrumentu.'

export const DEFAULT_WHY_POINTS: WhyPointInput[] = [
  {
    title: 'Indywidualne tempo',
    text: 'Program zajęć dopasowujemy do Twojego poziomu, celów i dostępnego czasu na ćwiczenia.',
    active: true,
  },
  {
    title: 'Praca nad brzmieniem',
    text: 'Uczymy się nie tylko chwytów, ale także słuchania, rytmu i świadomego prowadzenia dźwięku.',
    active: true,
  },
  {
    title: 'Repertuar z sensem',
    text: 'Ćwiczenia łączymy z utworami, które naprawdę chcesz grać — od podstaw po bardziej złożone aranżacje.',
    active: true,
  },
]

export const RECORDINGS_EYEBROW = 'Nagrania'
export const RECORDINGS_TITLE = 'Posłuchaj i zobacz'
export const RECORDINGS_DESCRIPTION = 'Filmy z oficjalnego kanału YouTube.'
export const RECORDINGS_BUTTON = 'Wszystkie nagrania'
export const RECORDINGS_EMPTY_MESSAGE = 'Pierwsze nagrania już wkrótce.'
export const RECORDINGS_PAGE_TITLE = 'Galeria filmów'
export const RECORDINGS_PAGE_INTRO = 'Wybrane materiały wideo.'

export const ABOUT_EYEBROW = 'O mnie'
export const ABOUT_INTRO = 'Nauczyciel gry na gitarze akustycznej.'
export const ABOUT_BIO_FALLBACK = [
  'Nazywam się Jacek Krakowski i prowadzę indywidualne lekcje gry na gitarze akustycznej pod marką Sześć Strun.',
  'Podczas zajęć stawiam na spokojną, konkretną pracę: technikę, brzmienie, rytm oraz repertuar dopasowany do Twoich celów.',
]
export const EXPERIENCE_HEADING = 'Doświadczenie'
export const METHOD_HEADING = 'Metoda nauczania'

export const DOWNLOADS_EYEBROW = 'Materiały'
export const DOWNLOADS_TITLE = 'Do pobrania'
export const DOWNLOADS_DESCRIPTION = 'Pliki, które możesz pobrać i zachować.'
export const DOWNLOADS_EMPTY_MESSAGE = 'Materiały pojawią się tutaj wkrótce.'

export const MENU_CTA_LABEL = 'Umów lekcję'

export const DEFAULT_NAVIGATION: NavItemInput[] = [
  { label: 'Strona główna', linkType: 'internal', internalPath: '/', active: true },
  { label: 'O mnie', linkType: 'internal', internalPath: '/o-mnie', active: true },
  { label: 'Oferta', linkType: 'internal', internalPath: '/oferta', active: true },
  { label: 'Cennik', linkType: 'internal', internalPath: '/cennik', active: false },
  { label: 'Do pobrania', linkType: 'internal', internalPath: '/do-pobrania', active: true },
  {
    label: 'Kursy',
    linkType: 'external',
    externalUrl: '',
    openInNewTab: true,
    active: false,
  },
  { label: 'Aktualności', linkType: 'internal', internalPath: '/aktualnosci', active: true },
  { label: 'Nagrania', linkType: 'internal', internalPath: '/nagrania', active: true },
  { label: 'Kontakt', linkType: 'internal', internalPath: '/kontakt', active: true },
]

export const DEFAULT_NAV_CTA: NavItemInput = {
  label: MENU_CTA_LABEL,
  linkType: 'internal',
  internalPath: '/kontakt',
  openInNewTab: false,
  active: true,
}

export function normalizeInternalPath(value: string | null | undefined): string | null {
  const path = value?.trim()
  if (!path) return null
  if (!path.startsWith('/') || path.startsWith('//')) return null
  if (path.includes('://') || path.includes('\\')) return null
  return path
}

export function normalizeExternalUrl(value: string | null | undefined): string | null {
  const raw = value?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return raw
  } catch {
    return null
  }
}

export function resolveHref(
  value: string | null | undefined,
  fallback: string,
): { href: string; external: boolean } {
  const raw = value?.trim()
  if (!raw) return { href: fallback, external: false }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    const external = normalizeExternalUrl(raw)
    return external ? { href: external, external: true } : { href: fallback, external: false }
  }
  const internal = normalizeInternalPath(raw.startsWith('/') ? raw : `/${raw}`)
  return { href: internal || fallback, external: false }
}

export function resolveNavItem(item: NavItemInput, index: number): ResolvedLink | null {
  if (item.active === false) return null
  const label = item.label?.trim()
  if (!label) return null

  const external = item.linkType === 'external'
  const href = external ? normalizeExternalUrl(item.externalUrl) : normalizeInternalPath(item.internalPath)
  if (!href) return null

  return {
    id: item.id || `${label}-${index}`,
    label,
    href,
    openInNewTab: Boolean(item.openInNewTab),
    external,
  }
}

/** Visible menu items, in the saved order. Null means “not configured yet”. */
export function resolveNavigation(items: NavItemInput[] | null | undefined): ResolvedLink[] {
  const source = items == null ? DEFAULT_NAVIGATION : items
  return source.flatMap((item, index) => {
    const resolved = resolveNavItem(item, index)
    return resolved ? [resolved] : []
  })
}

export function resolveFooterNavigation(items: NavItemInput[] | null | undefined): ResolvedLink[] {
  return resolveNavigation(items).filter(
    (item) => item.href !== '/' && item.href.split('?')[0] !== '/polityka-prywatnosci',
  )
}

export function resolveMenuCta(settings: SiteContentSettings): ResolvedLink | null {
  const cta = settings.navCta
  const configured = Boolean(
    cta &&
      (cta.label != null ||
        cta.active != null ||
        cta.internalPath != null ||
        cta.externalUrl != null ||
        cta.linkType != null),
  )

  if (!configured) {
    return {
      id: 'menu-cta',
      label: settings.heroCTA?.trim() || MENU_CTA_LABEL,
      href: '/kontakt',
      openInNewTab: false,
      external: false,
    }
  }

  if (cta?.active === false) return null

  return resolveNavItem(
    {
      id: 'menu-cta',
      label: cta?.label || settings.heroCTA || MENU_CTA_LABEL,
      linkType: cta?.linkType || 'internal',
      internalPath: cta?.internalPath || '/kontakt',
      externalUrl: cta?.externalUrl,
      openInNewTab: cta?.openInNewTab,
      active: true,
    },
    0,
  )
}

export type AboutPreviewContent = {
  eyebrow: string
  title: string
  lead: string
  text: string
  buttonLabel: string
  buttonHref: string
  buttonExternal: boolean
  image: RenderableMedia | null
}

export function resolveAboutPreview(settings: SiteContentSettings): AboutPreviewContent | null {
  if (settings.showAboutPreview === false) return null

  const button = resolveHref(settings.aboutPreviewButtonHref, '/o-mnie')

  return {
    eyebrow: firstNonEmpty(settings.aboutPreviewEyebrow, ABOUT_PREVIEW_EYEBROW) || ABOUT_PREVIEW_EYEBROW,
    title:
      firstNonEmpty(settings.aboutPreviewTitle, settings.teacherName, ABOUT_PREVIEW_TITLE) ||
      ABOUT_PREVIEW_TITLE,
    lead: firstNonEmpty(settings.aboutPreviewLead, ABOUT_PREVIEW_LEAD) || ABOUT_PREVIEW_LEAD,
    text: firstNonEmpty(settings.aboutPreviewText, ABOUT_PREVIEW_TEXT) || ABOUT_PREVIEW_TEXT,
    buttonLabel: firstNonEmpty(settings.aboutPreviewButtonLabel, ABOUT_PREVIEW_BUTTON) || ABOUT_PREVIEW_BUTTON,
    buttonHref: button.href,
    buttonExternal: button.external,
    image: resolveRenderableMedia(settings.aboutPreviewImage, settings.teacherName || ABOUT_PREVIEW_TITLE),
  }
}

export type WhySectionContent = {
  eyebrow: string
  title: string
  description: string
  points: ResolvedWhyPoint[]
}

export function resolveWhyPoints(points: WhyPointInput[] | null | undefined): ResolvedWhyPoint[] {
  const source = points == null ? DEFAULT_WHY_POINTS : points
  const visible = source.flatMap((point) => {
    if (point.active === false) return []
    const title = point.title?.trim()
    const text = point.text?.trim()
    if (!title || !text) return []
    return [{ id: point.id || title, title, text }]
  })

  return visible.map((point, index) => ({
    ...point,
    id: point.id || `why-${index}`,
    number: String(index + 1).padStart(2, '0'),
  }))
}

export function resolveWhySection(settings: SiteContentSettings): WhySectionContent | null {
  if (settings.showWhySection === false) return null
  const points = resolveWhyPoints(settings.whyPoints)
  if (points.length === 0) return null

  return {
    eyebrow: firstNonEmpty(settings.whyEyebrow, WHY_EYEBROW) || WHY_EYEBROW,
    title: firstNonEmpty(settings.whyTitle, WHY_TITLE) || WHY_TITLE,
    description: firstNonEmpty(settings.whyDescription, WHY_DESCRIPTION) || WHY_DESCRIPTION,
    points,
  }
}

export type RecordingsCopy = {
  show: boolean
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  buttonHref: string
  buttonExternal: boolean
  emptyBehavior: 'hide' | 'message'
  emptyMessage: string
  pageTitle: string
  pageIntro: string
}

export function resolveRecordingsCopy(settings: SiteContentSettings): RecordingsCopy {
  const button = resolveHref(settings.recordingsButtonHref, '/nagrania')
  return {
    show: settings.showRecordingsSection !== false,
    eyebrow: firstNonEmpty(settings.recordingsEyebrow, RECORDINGS_EYEBROW) || RECORDINGS_EYEBROW,
    title: firstNonEmpty(settings.recordingsTitle, RECORDINGS_TITLE) || RECORDINGS_TITLE,
    description:
      firstNonEmpty(settings.recordingsDescription, RECORDINGS_DESCRIPTION) || RECORDINGS_DESCRIPTION,
    buttonLabel: firstNonEmpty(settings.recordingsButtonLabel, RECORDINGS_BUTTON) || RECORDINGS_BUTTON,
    buttonHref: button.href,
    buttonExternal: button.external,
    emptyBehavior: settings.recordingsEmptyBehavior === 'hide' ? 'hide' : 'message',
    emptyMessage:
      firstNonEmpty(settings.recordingsEmptyMessage, RECORDINGS_EMPTY_MESSAGE) ||
      RECORDINGS_EMPTY_MESSAGE,
    pageTitle: firstNonEmpty(settings.recordingsPageTitle, RECORDINGS_PAGE_TITLE) || RECORDINGS_PAGE_TITLE,
    pageIntro: firstNonEmpty(settings.recordingsPageIntro, RECORDINGS_PAGE_INTRO) || RECORDINGS_PAGE_INTRO,
  }
}

export function shouldShowHomeRecordings(copy: RecordingsCopy, hasVideos: boolean): boolean {
  if (!copy.show) return false
  if (hasVideos) return true
  return copy.emptyBehavior !== 'hide'
}

export type AboutPageContent = {
  eyebrow: string
  title: string
  intro: string
  biography: RichTextValue
  biographyFallback: string[]
  experienceHeading: string
  experience: RichTextValue
  methodHeading: string
  method: RichTextValue
  photo: RenderableMedia | null
  gallery: Array<RenderableMedia & { id: string; caption?: string }>
  sections: Array<{ id: string; heading?: string; body: RichTextValue }>
  buttons: ResolvedLink[]
  seoTitle: string
  seoDescription: string
}

export function resolveAboutPage(settings: SiteContentSettings): AboutPageContent {
  const gallery = (settings.aboutGallery ?? []).flatMap((item, index) => {
    if (item.active === false) return []
    const image = resolveRenderableMedia(
      item.image,
      item.caption || settings.teacherName || ABOUT_PREVIEW_TITLE,
    )
    if (!image) return []
    return [{ ...image, id: item.id || `about-photo-${index}`, caption: item.caption?.trim() || undefined }]
  })

  const sections = (settings.aboutSections ?? []).flatMap((section, index) => {
    if (section.active === false) return []
    const heading = section.heading?.trim()
    if (!heading && !section.body) return []
    return [{ id: section.id || `about-section-${index}`, heading: heading || undefined, body: section.body }]
  })

  return {
    eyebrow: firstNonEmpty(settings.aboutEyebrow, ABOUT_EYEBROW) || ABOUT_EYEBROW,
    title: firstNonEmpty(settings.aboutHeading, settings.teacherName, ABOUT_PREVIEW_TITLE) || ABOUT_PREVIEW_TITLE,
    intro: firstNonEmpty(settings.aboutIntro, ABOUT_INTRO) || ABOUT_INTRO,
    biography: settings.teacherBiography,
    biographyFallback: settings.teacherBiography ? [] : ABOUT_BIO_FALLBACK,
    experienceHeading:
      firstNonEmpty(settings.teacherExperienceHeading, EXPERIENCE_HEADING) || EXPERIENCE_HEADING,
    experience: settings.teacherExperience,
    methodHeading: firstNonEmpty(settings.teacherMethodHeading, METHOD_HEADING) || METHOD_HEADING,
    method: settings.teacherMethod,
    photo: resolveRenderableMedia(settings.aboutPhoto, settings.teacherName || ABOUT_PREVIEW_TITLE),
    gallery,
    sections,
    buttons: resolveNavigation(settings.aboutButtons ?? []),
    seoTitle: firstNonEmpty(settings.aboutSeoTitle, SEO_DEFAULTS.about.title) || SEO_DEFAULTS.about.title,
    seoDescription:
      firstNonEmpty(settings.aboutSeoDescription, SEO_DEFAULTS.about.description) ||
      SEO_DEFAULTS.about.description,
  }
}

export type DownloadsPageContent = {
  eyebrow: string
  title: string
  description: string
  emptyMessage: string
  seoTitle: string
  seoDescription: string
}

export function resolveDownloadsPage(settings: SiteContentSettings): DownloadsPageContent {
  return {
    eyebrow: firstNonEmpty(settings.downloadsEyebrow, DOWNLOADS_EYEBROW) || DOWNLOADS_EYEBROW,
    title: firstNonEmpty(settings.downloadsTitle, DOWNLOADS_TITLE) || DOWNLOADS_TITLE,
    description:
      firstNonEmpty(settings.downloadsDescription, DOWNLOADS_DESCRIPTION) || DOWNLOADS_DESCRIPTION,
    emptyMessage:
      firstNonEmpty(settings.downloadsEmptyMessage, DOWNLOADS_EMPTY_MESSAGE) || DOWNLOADS_EMPTY_MESSAGE,
    seoTitle:
      firstNonEmpty(settings.downloadsSeoTitle, SEO_DEFAULTS.downloads.title) || SEO_DEFAULTS.downloads.title,
    seoDescription:
      firstNonEmpty(settings.downloadsSeoDescription, SEO_DEFAULTS.downloads.description) ||
      SEO_DEFAULTS.downloads.description,
  }
}

export function resolveFooterNote(settings: SiteContentSettings): string {
  return (
    firstNonEmpty(settings.footerNote, settings.siteDescription, 'Indywidualne lekcje gry na gitarze akustycznej.') ||
    'Indywidualne lekcje gry na gitarze akustycznej.'
  )
}

const TEXT_DEFAULTS: Array<[keyof SiteContentSettings, string]> = [
  ['aboutPreviewEyebrow', ABOUT_PREVIEW_EYEBROW],
  ['aboutPreviewTitle', ABOUT_PREVIEW_TITLE],
  ['aboutPreviewLead', ABOUT_PREVIEW_LEAD],
  ['aboutPreviewText', ABOUT_PREVIEW_TEXT],
  ['aboutPreviewButtonLabel', ABOUT_PREVIEW_BUTTON],
  ['aboutPreviewButtonHref', '/o-mnie'],
  ['whyEyebrow', WHY_EYEBROW],
  ['whyTitle', WHY_TITLE],
  ['whyDescription', WHY_DESCRIPTION],
  ['recordingsEyebrow', RECORDINGS_EYEBROW],
  ['recordingsTitle', RECORDINGS_TITLE],
  ['recordingsDescription', RECORDINGS_DESCRIPTION],
  ['recordingsButtonLabel', RECORDINGS_BUTTON],
  ['recordingsButtonHref', '/nagrania'],
  ['recordingsEmptyMessage', RECORDINGS_EMPTY_MESSAGE],
  ['recordingsPageTitle', RECORDINGS_PAGE_TITLE],
  ['recordingsPageIntro', RECORDINGS_PAGE_INTRO],
  ['aboutEyebrow', ABOUT_EYEBROW],
  ['aboutIntro', ABOUT_INTRO],
  ['teacherExperienceHeading', EXPERIENCE_HEADING],
  ['teacherMethodHeading', METHOD_HEADING],
  ['aboutSeoTitle', SEO_DEFAULTS.about.title],
  ['aboutSeoDescription', SEO_DEFAULTS.about.description],
  ['downloadsEyebrow', DOWNLOADS_EYEBROW],
  ['downloadsTitle', DOWNLOADS_TITLE],
  ['downloadsDescription', DOWNLOADS_DESCRIPTION],
  ['downloadsEmptyMessage', DOWNLOADS_EMPTY_MESSAGE],
  ['downloadsSeoTitle', SEO_DEFAULTS.downloads.title],
  ['downloadsSeoDescription', SEO_DEFAULTS.downloads.description],
]

function isBlank(value: unknown): boolean {
  return value == null || (typeof value === 'string' && value.trim() === '')
}

/**
 * Fills only empty new fields. Existing biography, hero copy and a menu the
 * owner already saved are left untouched. Safe to run more than once.
 */
export function buildInitialContentPatch(
  current: SiteContentSettings,
): Record<string, unknown> | null {
  const patch: Record<string, unknown> = {}

  if (!Array.isArray(current.navigation) || current.navigation.length === 0) {
    patch.navigation = DEFAULT_NAVIGATION
  }

  if (!Array.isArray(current.whyPoints) || current.whyPoints.length === 0) {
    patch.whyPoints = DEFAULT_WHY_POINTS
  }

  if (isBlank(current.navCta?.label) && isBlank(current.navCta?.internalPath)) {
    patch.navCta = DEFAULT_NAV_CTA
  }

  if (current.showAboutPreview == null) patch.showAboutPreview = true
  if (current.showWhySection == null) patch.showWhySection = true
  if (current.showRecordingsSection == null) patch.showRecordingsSection = true
  if (current.recordingsEmptyBehavior == null) patch.recordingsEmptyBehavior = 'message'

  for (const [key, value] of TEXT_DEFAULTS) {
    if (isBlank(current[key])) patch[key] = value
  }

  return Object.keys(patch).length > 0 ? patch : null
}
