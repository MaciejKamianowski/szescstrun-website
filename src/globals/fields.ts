import type { Field } from 'payload'

import {
  ABOUT_INTRO,
  ABOUT_PREVIEW_BUTTON,
  ABOUT_PREVIEW_EYEBROW,
  ABOUT_PREVIEW_LEAD,
  ABOUT_PREVIEW_TEXT,
  ABOUT_PREVIEW_TITLE,
  DEFAULT_NAVIGATION,
  DEFAULT_NAV_CTA,
  DEFAULT_WHY_POINTS,
  DOWNLOADS_DESCRIPTION,
  DOWNLOADS_EMPTY_MESSAGE,
  DOWNLOADS_EYEBROW,
  DOWNLOADS_TITLE,
  EXPERIENCE_HEADING,
  METHOD_HEADING,
  RECORDINGS_BUTTON,
  RECORDINGS_DESCRIPTION,
  RECORDINGS_EMPTY_MESSAGE,
  RECORDINGS_EYEBROW,
  RECORDINGS_PAGE_INTRO,
  RECORDINGS_PAGE_TITLE,
  RECORDINGS_TITLE,
  WHY_DESCRIPTION,
  WHY_EYEBROW,
  WHY_TITLE,
} from '@/lib/site-content'
import { SEO_DEFAULTS } from '@/lib/seo-defaults'

const activeDescription = 'Aktywna — określa, czy element jest widoczny na stronie.'
const eyebrowDescription = 'Nadtytuł — mały tekst wyświetlany nad głównym nagłówkiem sekcji.'
const urlDescription = 'Adres URL — dokąd ma prowadzić przycisk lub odnośnik.'

export function linkTargetFields(defaults?: { internalPath?: string }): Field[] {
  return [
    {
      name: 'linkType',
      type: 'select',
      label: 'Rodzaj odnośnika',
      required: true,
      defaultValue: 'internal',
      options: [
        { label: 'Strona wewnętrzna', value: 'internal' },
        { label: 'Adres zewnętrzny', value: 'external' },
      ],
      admin: {
        description: 'Strona tej witryny albo adres prowadzący poza nią, na przykład panel kursów.',
      },
    },
    {
      name: 'internalPath',
      type: 'text',
      label: 'Adres strony',
      defaultValue: defaults?.internalPath,
      admin: {
        description: `${urlDescription} Dla stron tej witryny zaczyna się od ukośnika, np. /o-mnie albo /do-pobrania.`,
        condition: (_, siblingData) => siblingData?.linkType !== 'external',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Adres zewnętrzny',
      admin: {
        description:
          'Pełny adres zaczynający się od https://. Dla pozycji „Kursy” wpisz tu adres panelu kursów, gdy będzie znany. Puste pole nie tworzy odnośnika.',
        condition: (_, siblingData) => siblingData?.linkType === 'external',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: 'Otwórz w nowej karcie',
      defaultValue: false,
    },
  ]
}

function visibilityCheckbox(label: string, description: string): Field {
  return {
    name: 'active',
    type: 'checkbox',
    label,
    defaultValue: true,
    admin: { description },
  }
}

export function navigationFields(): Field[] {
  return [
    {
      name: 'navigation',
      type: 'array',
      label: 'Pozycje menu',
      labels: { singular: 'Pozycja menu', plural: 'Pozycje menu' },
      defaultValue: DEFAULT_NAVIGATION,
      admin: {
        description:
          'To jedyne menu witryny — u góry strony i w stopce. Kolejność zmienisz, przeciągając pozycje. Odznacz „Aktywna”, aby ukryć pozycję bez usuwania. „Cennik” jest ukryty, ale strona /cennik nadal działa. „Kursy” włączysz dopiero po wpisaniu prawdziwego adresu panelu.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etykieta',
          required: true,
        },
        ...linkTargetFields(),
        visibilityCheckbox('Aktywna', `${activeDescription} Odznacz, aby ukryć pozycję bez jej usuwania.`),
      ],
    },
    {
      name: 'navCta',
      type: 'group',
      label: 'Przycisk w menu',
      admin: {
        description: 'Przycisk po prawej stronie menu. Domyślnie „Umów lekcję” prowadzi do strony Kontakt.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Tekst przycisku',
          defaultValue: DEFAULT_NAV_CTA.label || 'Umów lekcję',
        },
        visibilityCheckbox('Pokazuj przycisk', 'Odznacz, aby schować przycisk bez usuwania jego treści.'),
        ...linkTargetFields({ internalPath: '/kontakt' }),
      ],
    },
  ]
}

export function homepageFields(): Field[] {
  return [
    {
      type: 'collapsible',
      label: 'Sekcja powitalna',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'heroHeading',
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'SZEŚĆ STRUN.\nNIESKOŃCZONE MOŻLIWOŚCI.',
          admin: {
            description: 'Nowa linia w tekście tworzy drugą linię nagłówka.',
          },
        },
        {
          name: 'heroDescription',
          type: 'textarea',
          label: 'Opis',
          defaultValue:
            'Odkryj świat gitary akustycznej i rozwijaj swoje umiejętności podczas indywidualnych lekcji.',
        },
        {
          name: 'heroCTA',
          type: 'text',
          label: 'Tekst przycisku',
          defaultValue: 'Umów lekcję',
          admin: {
            description: 'Przycisk w sekcji powitalnej. Przycisk w menu ustawiasz w zakładce Nawigacja.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Sekcja „Poznaj Jacka”',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'showAboutPreview',
          type: 'checkbox',
          label: 'Pokazuj sekcję',
          defaultValue: true,
          admin: { description: 'Odznacz, aby ukryć całą sekcję na stronie głównej.' },
        },
        {
          name: 'aboutPreviewEyebrow',
          type: 'text',
          label: 'Nadtytuł',
          defaultValue: ABOUT_PREVIEW_EYEBROW,
          admin: { description: eyebrowDescription },
        },
        {
          name: 'aboutPreviewTitle',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: ABOUT_PREVIEW_TITLE,
        },
        {
          name: 'aboutPreviewLead',
          type: 'textarea',
          label: 'Opis po lewej',
          defaultValue: ABOUT_PREVIEW_LEAD,
        },
        {
          name: 'aboutPreviewText',
          type: 'textarea',
          label: 'Opis po prawej',
          defaultValue: ABOUT_PREVIEW_TEXT,
        },
        {
          name: 'aboutPreviewButtonLabel',
          type: 'text',
          label: 'Tekst przycisku',
          defaultValue: ABOUT_PREVIEW_BUTTON,
        },
        {
          name: 'aboutPreviewButtonHref',
          type: 'text',
          label: 'Cel przycisku',
          defaultValue: '/o-mnie',
          admin: { description: urlDescription },
        },
        {
          name: 'aboutPreviewImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
          admin: {
            description:
              'Opcjonalne. Puste pole zostawia sekcję samą z tekstem, tak jak dotychczas. Zdjęcie w górnej części strony ustawiasz niżej jako „Zdjęcie nauczyciela” w zakładce O mnie.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Sekcja „Dlaczego warto”',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'showWhySection',
          type: 'checkbox',
          label: 'Pokazuj sekcję',
          defaultValue: true,
          admin: { description: 'Odznacz, aby ukryć całą sekcję na stronie głównej.' },
        },
        {
          name: 'whyEyebrow',
          type: 'text',
          label: 'Nadtytuł',
          defaultValue: WHY_EYEBROW,
          admin: { description: eyebrowDescription },
        },
        {
          name: 'whyTitle',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: WHY_TITLE,
        },
        {
          name: 'whyDescription',
          type: 'textarea',
          label: 'Opis',
          defaultValue: WHY_DESCRIPTION,
        },
        {
          name: 'whyPoints',
          type: 'array',
          label: 'Elementy',
          labels: { singular: 'Element', plural: 'Elementy' },
          defaultValue: DEFAULT_WHY_POINTS,
          admin: {
            description:
              'Kolejność zmienisz, przeciągając elementy. Numery 01, 02, 03 powstają automatycznie z kolejności widocznych pozycji.',
            initCollapsed: false,
          },
          fields: [
            { name: 'title', type: 'text', label: 'Tytuł', required: true },
            { name: 'text', type: 'textarea', label: 'Tekst', required: true },
            visibilityCheckbox('Aktywny', `${activeDescription} Odznacz, aby ukryć element bez usuwania.`),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Sekcja „Nagrania”',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'showRecordingsSection',
          type: 'checkbox',
          label: 'Pokazuj sekcję na stronie głównej',
          defaultValue: true,
          admin: { description: 'Odznacz, aby ukryć całą sekcję, także gdy nagrania już są dodane.' },
        },
        {
          name: 'recordingsEyebrow',
          type: 'text',
          label: 'Nadtytuł',
          defaultValue: RECORDINGS_EYEBROW,
          admin: { description: eyebrowDescription },
        },
        {
          name: 'recordingsTitle',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: RECORDINGS_TITLE,
        },
        {
          name: 'recordingsDescription',
          type: 'textarea',
          label: 'Opis',
          defaultValue: RECORDINGS_DESCRIPTION,
        },
        {
          name: 'recordingsButtonLabel',
          type: 'text',
          label: 'Tekst przycisku',
          defaultValue: RECORDINGS_BUTTON,
        },
        {
          name: 'recordingsButtonHref',
          type: 'text',
          label: 'Cel przycisku',
          defaultValue: '/nagrania',
          admin: { description: urlDescription },
        },
        {
          name: 'recordingsEmptyBehavior',
          type: 'select',
          label: 'Gdy nie ma jeszcze nagrań',
          defaultValue: 'message',
          options: [
            { label: 'Pokaż własny komunikat', value: 'message' },
            { label: 'Ukryj całą sekcję', value: 'hide' },
          ],
          admin: {
            description: 'Dotyczy strony głównej. Same filmy dodajesz w kolekcji Nagrania.',
          },
        },
        {
          name: 'recordingsEmptyMessage',
          type: 'textarea',
          label: 'Komunikat pustej sekcji',
          defaultValue: RECORDINGS_EMPTY_MESSAGE,
        },
        {
          name: 'recordingsPageTitle',
          type: 'text',
          label: 'Nagłówek podstrony Nagrania',
          defaultValue: RECORDINGS_PAGE_TITLE,
        },
        {
          name: 'recordingsPageIntro',
          type: 'textarea',
          label: 'Wstęp podstrony Nagrania',
          defaultValue: RECORDINGS_PAGE_INTRO,
        },
      ],
    },
  ]
}

export function aboutFields(): Field[] {
  return [
    {
      name: 'teacherName',
      type: 'text',
      label: 'Imię i nazwisko',
      required: true,
      defaultValue: 'Jacek Krakowski',
      admin: {
        description: 'Używane w nagłówkach, stopce i danych kontaktowych.',
      },
    },
    {
      name: 'teacherPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie nauczyciela',
      admin: {
        description: 'Duże zdjęcie w sekcji powitalnej na stronie głównej.',
      },
    },
    {
      name: 'aboutEyebrow',
      type: 'text',
      label: 'Nadtytuł strony O mnie',
      defaultValue: 'O mnie',
      admin: { description: eyebrowDescription },
    },
    {
      name: 'aboutHeading',
      type: 'text',
      label: 'Nagłówek strony O mnie',
      admin: {
        description: 'Jeśli puste, używane jest imię i nazwisko.',
      },
    },
    {
      name: 'aboutIntro',
      type: 'textarea',
      label: 'Wstęp',
      defaultValue: ABOUT_INTRO,
    },
    {
      name: 'teacherBiography',
      type: 'richText',
      label: 'Biografia',
      admin: {
        description: 'Główny tekst strony O mnie. Zostaw puste, aby pokazać dotychczasowy krótki wstęp.',
      },
    },
    {
      name: 'teacherExperienceHeading',
      type: 'text',
      label: 'Nagłówek doświadczenia',
      defaultValue: EXPERIENCE_HEADING,
    },
    {
      name: 'teacherExperience',
      type: 'richText',
      label: 'Doświadczenie',
      admin: {
        description: 'Puste pole ukrywa tę część strony. Nie dodawaj treści, których nie chcesz publikować.',
      },
    },
    {
      name: 'teacherMethodHeading',
      type: 'text',
      label: 'Nagłówek metody',
      defaultValue: METHOD_HEADING,
    },
    {
      name: 'teacherMethod',
      type: 'richText',
      label: 'Metoda nauczania',
      admin: {
        description: 'Puste pole ukrywa tę część strony.',
      },
    },
    {
      name: 'aboutPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie na stronie O mnie',
      admin: {
        description: 'Opcjonalne zdjęcie pod nagłówkiem. To nie jest zdjęcie z sekcji powitalnej.',
      },
    },
    {
      name: 'aboutGallery',
      type: 'array',
      label: 'Galeria',
      labels: { singular: 'Zdjęcie', plural: 'Zdjęcia' },
      admin: {
        description: 'Dodatkowe zdjęcia na stronie O mnie. Pusta galeria się nie wyświetla.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
          required: true,
        },
        { name: 'caption', type: 'text', label: 'Podpis' },
        visibilityCheckbox('Aktywne', activeDescription),
      ],
    },
    {
      name: 'aboutSections',
      type: 'array',
      label: 'Dodatkowe sekcje',
      labels: { singular: 'Sekcja', plural: 'Sekcje' },
      admin: {
        description: 'Kolejne bloki tekstu pod biografią. Kolejność zmienisz, przeciągając sekcje.',
      },
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek' },
        { name: 'body', type: 'richText', label: 'Treść' },
        visibilityCheckbox('Aktywna', activeDescription),
      ],
    },
    {
      name: 'aboutButtons',
      type: 'array',
      label: 'Przyciski',
      labels: { singular: 'Przycisk', plural: 'Przyciski' },
      fields: [
        { name: 'label', type: 'text', label: 'Tekst przycisku', required: true },
        ...linkTargetFields(),
        visibilityCheckbox('Aktywny', activeDescription),
      ],
    },
    {
      name: 'aboutSeoTitle',
      type: 'text',
      label: 'Tytuł SEO',
      defaultValue: SEO_DEFAULTS.about.title,
      admin: { description: 'Tytuł widoczny w Google i przy udostępnianiu strony O mnie.' },
    },
    {
      name: 'aboutSeoDescription',
      type: 'textarea',
      label: 'Opis SEO',
      defaultValue: SEO_DEFAULTS.about.description,
    },
  ]
}

export function footerFields(): Field[] {
  return [
    {
      name: 'footerNote',
      type: 'textarea',
      label: 'Tekst pod logo',
      admin: {
        description:
          'Tekst w lewej kolumnie stopki. Jeśli puste, używany jest opis strony z zakładki Ogólne. Odnośniki w stopce pochodzą z zakładki Nawigacja. Polityka prywatności jest zawsze na dole stopki.',
      },
    },
  ]
}

export function downloadsPageFields(): Field[] {
  return [
    {
      name: 'downloadsEyebrow',
      type: 'text',
      label: 'Nadtytuł',
      defaultValue: DOWNLOADS_EYEBROW,
      admin: {
        description: `${eyebrowDescription} Same pliki dodajesz w kolekcji „Materiały do pobrania”.`,
      },
    },
    {
      name: 'downloadsTitle',
      type: 'text',
      label: 'Nagłówek',
      defaultValue: DOWNLOADS_TITLE,
    },
    {
      name: 'downloadsDescription',
      type: 'textarea',
      label: 'Opis',
      defaultValue: DOWNLOADS_DESCRIPTION,
    },
    {
      name: 'downloadsEmptyMessage',
      type: 'textarea',
      label: 'Komunikat, gdy nie ma plików',
      defaultValue: DOWNLOADS_EMPTY_MESSAGE,
      admin: {
        description: 'Ten tekst zobaczy odwiedzający, dopóki nie opublikujesz żadnego materiału.',
      },
    },
    {
      name: 'downloadsSeoTitle',
      type: 'text',
      label: 'Tytuł SEO',
      defaultValue: SEO_DEFAULTS.downloads.title,
    },
    {
      name: 'downloadsSeoDescription',
      type: 'textarea',
      label: 'Opis SEO',
      defaultValue: SEO_DEFAULTS.downloads.description,
    },
  ]
}
