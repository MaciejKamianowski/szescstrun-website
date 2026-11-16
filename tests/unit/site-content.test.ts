import { describe, expect, it } from 'vitest'

import {
  ABOUT_PREVIEW_LEAD,
  ABOUT_PREVIEW_TEXT,
  DEFAULT_NAVIGATION,
  DEFAULT_WHY_POINTS,
  WHY_DESCRIPTION,
  buildInitialContentPatch,
  resolveAboutPage,
  resolveAboutPreview,
  resolveMenuCta,
  resolveNavigation,
  resolveRecordingsCopy,
  resolveWhyPoints,
  resolveWhySection,
  shouldShowHomeRecordings,
} from '../../src/lib/site-content'

describe('menu nawigacyjne', () => {
  it('ukrywa Cennik i nie publikuje Kursów bez adresu', () => {
    const labels = resolveNavigation(DEFAULT_NAVIGATION).map((item) => item.label)

    expect(labels).toEqual([
      'Strona główna',
      'O mnie',
      'Oferta',
      'Do pobrania',
      'Aktualności',
      'Nagrania',
      'Kontakt',
    ])
    expect(labels).not.toContain('Cennik')
    expect(labels).not.toContain('Kursy')
    expect(
      resolveNavigation(DEFAULT_NAVIGATION)
        .filter((item) => item.href !== '/' && item.href !== '/polityka-prywatnosci')
        .some((item) => item.label === 'Do pobrania'),
    ).toBe(true)
  })

  it('dodaje, usuwa i zmienia kolejność pozycji', () => {
    const items = [
      { id: 'b', label: 'Kontakt', linkType: 'internal' as const, internalPath: '/kontakt', active: true },
      { id: 'a', label: 'O mnie', linkType: 'internal' as const, internalPath: '/o-mnie', active: true },
    ]

    expect(resolveNavigation(items).map((item) => item.label)).toEqual(['Kontakt', 'O mnie'])

    const withExtra = [
      ...items,
      {
        id: 'c',
        label: 'Do pobrania',
        linkType: 'internal' as const,
        internalPath: '/do-pobrania',
        active: true,
      },
    ]
    expect(resolveNavigation(withExtra).map((item) => item.href)).toEqual([
      '/kontakt',
      '/o-mnie',
      '/do-pobrania',
    ])

    expect(resolveNavigation(items.filter((item) => item.id !== 'b')).map((item) => item.label)).toEqual([
      'O mnie',
    ])
  })

  it('ukrywa nieaktywną pozycję bez usuwania jej z konfiguracji', () => {
    const items = DEFAULT_NAVIGATION.map((item) =>
      item.label === 'Oferta' ? { ...item, active: false } : item,
    )

    expect(items.some((item) => item.label === 'Oferta')).toBe(true)
    expect(resolveNavigation(items).some((item) => item.label === 'Oferta')).toBe(false)
  })

  it('rozróżnia link wewnętrzny i zewnętrzny oraz nie wstawia martwego adresu', () => {
    const resolved = resolveNavigation([
      { label: 'O mnie', linkType: 'internal', internalPath: '/o-mnie', active: true },
      {
        label: 'Facebook',
        linkType: 'external',
        externalUrl: 'https://facebook.com/szescstrun',
        openInNewTab: true,
        active: true,
      },
      { label: 'Kursy', linkType: 'external', externalUrl: '', active: true },
      { label: 'Zły', linkType: 'external', externalUrl: 'javascript:alert(1)', active: true },
      { label: 'Poza', linkType: 'internal', internalPath: 'https://evil.example', active: true },
    ])

    expect(resolved).toEqual([
      { id: 'O mnie-0', label: 'O mnie', href: '/o-mnie', openInNewTab: false, external: false },
      {
        id: 'Facebook-1',
        label: 'Facebook',
        href: 'https://facebook.com/szescstrun',
        openInNewTab: true,
        external: true,
      },
    ])
  })

  it('uruchamia Kursy dopiero z prawdziwym adresem', () => {
    const hidden = DEFAULT_NAVIGATION.map((item) =>
      item.label === 'Kursy' ? { ...item, active: true, externalUrl: '   ' } : item,
    )
    expect(resolveNavigation(hidden).some((item) => item.label === 'Kursy')).toBe(false)

    const live = DEFAULT_NAVIGATION.map((item) =>
      item.label === 'Kursy'
        ? { ...item, active: true, externalUrl: 'https://kursy.example.com/panel', openInNewTab: true }
        : item,
    )
    const kursy = resolveNavigation(live).find((item) => item.label === 'Kursy')
    expect(kursy).toMatchObject({
      href: 'https://kursy.example.com/panel',
      external: true,
      openInNewTab: true,
    })
  })

  it('pozwala zmienić przycisk Umów lekcję i ukryć go', () => {
    expect(
      resolveMenuCta({
        navCta: {
          label: 'Zapisz się',
          linkType: 'internal',
          internalPath: '/kontakt',
          active: true,
        },
      }),
    ).toMatchObject({ label: 'Zapisz się', href: '/kontakt' })

    expect(
      resolveMenuCta({
        navCta: { label: 'Umów lekcję', active: false, linkType: 'internal', internalPath: '/kontakt' },
      }),
    ).toBeNull()
  })
})

describe('sekcje strony', () => {
  it('edytuje sekcję Poznaj Jacka i pozwala ją ukryć', () => {
    const content = resolveAboutPreview({
      aboutPreviewEyebrow: 'Nauczyciel',
      aboutPreviewTitle: 'Jacek',
      aboutPreviewLead: 'Lewa',
      aboutPreviewText: 'Prawa',
      aboutPreviewButtonLabel: 'Czytaj',
      aboutPreviewButtonHref: '/o-mnie',
    })

    expect(content).toMatchObject({
      eyebrow: 'Nauczyciel',
      title: 'Jacek',
      lead: 'Lewa',
      text: 'Prawa',
      buttonLabel: 'Czytaj',
      buttonHref: '/o-mnie',
    })
    expect(resolveAboutPreview({ showAboutPreview: false })).toBeNull()
  })

  it('zachowuje dotychczasowe teksty, gdy pola nie są jeszcze zapisane', () => {
    const about = resolveAboutPreview({})
    const why = resolveWhySection({})

    expect(about?.lead).toBe(ABOUT_PREVIEW_LEAD)
    expect(about?.text).toBe(ABOUT_PREVIEW_TEXT)
    expect(why?.description).toBe(WHY_DESCRIPTION)
    expect(why?.points.map((point) => point.number)).toEqual(['01', '02', '03'])
  })

  it('numeruje widoczne elementy Dlaczego warto po kolei i pozwala je usuwać', () => {
    const points = resolveWhyPoints([
      { ...DEFAULT_WHY_POINTS[0], active: false },
      DEFAULT_WHY_POINTS[1],
      { title: 'Nowy punkt', text: 'Dodany przez właściciela.', active: true },
    ])

    expect(points.map((point) => [point.number, point.title])).toEqual([
      ['01', 'Praca nad brzmieniem'],
      ['02', 'Nowy punkt'],
    ])
    expect(resolveWhySection({ showWhySection: false })).toBeNull()
    expect(resolveWhySection({ whyPoints: [] })).toBeNull()
  })

  it('edytuje sekcję nagrań i nie pokazuje technicznego komunikatu o panelu', () => {
    const copy = resolveRecordingsCopy({
      recordingsTitle: 'Posłuchaj',
      recordingsEmptyMessage: 'Pierwsze nagrania już wkrótce.',
      recordingsEmptyBehavior: 'message',
    })

    expect(copy.title).toBe('Posłuchaj')
    expect(copy.emptyMessage).toBe('Pierwsze nagrania już wkrótce.')
    expect(copy.emptyMessage.toLowerCase()).not.toMatch(/cms|panel/)
    expect(shouldShowHomeRecordings(copy, false)).toBe(true)
    expect(shouldShowHomeRecordings({ ...copy, emptyBehavior: 'hide' }, false)).toBe(false)
    expect(shouldShowHomeRecordings({ ...copy, show: false }, true)).toBe(false)
    expect(shouldShowHomeRecordings({ ...copy, emptyBehavior: 'hide' }, true)).toBe(true)
  })

  it('edytuje stronę O mnie bez dopisywania biografii, której nie ma w CMS', () => {
    const page = resolveAboutPage({
      teacherName: 'Jacek Krakowski',
      aboutIntro: 'Nauczyciel gry na gitarze akustycznej.',
      teacherExperienceHeading: 'Droga',
      teacherMethodHeading: 'Sposób pracy',
    })

    expect(page.title).toBe('Jacek Krakowski')
    expect(page.intro).toBe('Nauczyciel gry na gitarze akustycznej.')
    expect(page.experience).toBeUndefined()
    expect(page.method).toBeUndefined()
    expect(page.biographyFallback.join(' ')).not.toMatch(/CMS|panelu administracyjnego/)
    expect(page.seoTitle).toMatch(/Jacek Krakowski/)
  })
})

describe('zachowanie istniejących danych', () => {
  it('nie nadpisuje zapisanego menu, biografii ani nagłówka hero', () => {
    const patch = buildInitialContentPatch({
      teacherName: 'Jacek Krakowski',
      heroCTA: 'Umów lekcję',
      navigation: [{ label: 'Start', linkType: 'internal', internalPath: '/', active: true }],
      whyPoints: [{ title: 'Własny punkt', text: 'Zostaje.', active: true }],
      whyEyebrow: 'Metoda',
      whyTitle: 'Dlaczego warto',
      whyDescription: WHY_DESCRIPTION,
      navCta: { label: 'Zapisz się', linkType: 'internal', internalPath: '/kontakt', active: true },
      showAboutPreview: true,
      showWhySection: true,
      showRecordingsSection: false,
      recordingsEmptyBehavior: 'hide',
      aboutPreviewEyebrow: 'O nauczycielu',
      aboutPreviewTitle: 'Jacek Krakowski',
      aboutPreviewLead: ABOUT_PREVIEW_LEAD,
      aboutPreviewText: ABOUT_PREVIEW_TEXT,
      aboutPreviewButtonLabel: 'Poznaj Jacka',
      aboutPreviewButtonHref: '/o-mnie',
      recordingsEyebrow: 'Nagrania',
      recordingsTitle: 'Posłuchaj i zobacz',
      recordingsDescription: 'Filmy z oficjalnego kanału YouTube.',
      recordingsButtonLabel: 'Wszystkie nagrania',
      recordingsButtonHref: '/nagrania',
      recordingsEmptyMessage: 'Pierwsze nagrania już wkrótce.',
      recordingsPageTitle: 'Galeria filmów',
      recordingsPageIntro: 'Wybrane materiały wideo.',
      aboutEyebrow: 'O mnie',
      aboutIntro: 'Nauczyciel gry na gitarze akustycznej.',
      teacherExperienceHeading: 'Doświadczenie',
      teacherMethodHeading: 'Metoda nauczania',
      aboutSeoTitle: 'Tytuł',
      aboutSeoDescription: 'Opis',
      downloadsEyebrow: 'Materiały',
      downloadsTitle: 'Do pobrania',
      downloadsDescription: 'Pliki, które możesz pobrać i zachować.',
      downloadsEmptyMessage: 'Materiały pojawią się tutaj wkrótce.',
      downloadsSeoTitle: 'SEO',
      downloadsSeoDescription: 'Opis SEO',
    })

    expect(patch).toBeNull()
  })

  it('uzupełnia puste nowe pola obecnymi tekstami strony', () => {
    const patch = buildInitialContentPatch({
      teacherName: 'Jacek Krakowski',
      heroCTA: 'Napisz',
    })

    expect(patch).not.toHaveProperty('teacherName')
    expect(patch).not.toHaveProperty('heroCTA')
    expect(patch).not.toHaveProperty('teacherBiography')
    expect(patch?.navigation).toEqual(DEFAULT_NAVIGATION)
    expect(patch?.whyPoints).toEqual(DEFAULT_WHY_POINTS)
    expect(patch?.aboutPreviewLead).toBe(ABOUT_PREVIEW_LEAD)
    expect(patch?.showRecordingsSection).toBe(true)
  })
})
