import type { GlobalConfig } from 'payload'

import { adminsAndEditors, anyone } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ustawienia strony',
  access: {
    read: anyone,
    update: adminsAndEditors,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ogólne',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Nazwa strony',
              required: true,
              defaultValue: 'Sześć Strun',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Hasło',
              defaultValue: 'Nieskończone możliwości.',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Opis strony',
              defaultValue:
                'Indywidualne lekcje gry na gitarze akustycznej z Jackiem Krakowskim.',
            },
            {
              name: 'siteLogo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo główne (header)',
              admin: {
                description:
                  'Oficjalny logotyp. Jeśli puste — używane jest domyślne logo z public/images/szesc-strun-logo.jpeg.',
              },
            },
            {
              name: 'footerLogo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo w stopce (opcjonalne)',
              admin: {
                description: 'Osobny wariant do stopki. Jeśli puste — używane jest logo główne lub domyślne.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon / ikona witryny',
              admin: {
                description:
                  'Kwadratowa ikona (najlepiej symbol łuku ze strunami). Jeśli puste — domyślne pliki z public/icons.',
              },
            },
          ],
        },
        {
          label: 'Nauczyciel',
          fields: [
            {
              name: 'teacherName',
              type: 'text',
              label: 'Imię i nazwisko nauczyciela',
              required: true,
              defaultValue: 'Jacek Krakowski',
            },
            {
              name: 'teacherBiography',
              type: 'richText',
              label: 'Biografia',
            },
            {
              name: 'teacherPhoto',
              type: 'upload',
              relationTo: 'media',
              label: 'Zdjęcie nauczyciela',
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'E-mail kontaktowy',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Telefon',
            },
            {
              name: 'locationCity',
              type: 'text',
              label: 'Miasto',
              admin: {
                description: 'Uzupełnij, gdy lokalizacja zajęć zostanie ustalona.',
              },
            },
            {
              name: 'locationAddress',
              type: 'text',
              label: 'Adres',
            },
            {
              name: 'lessonsOnline',
              type: 'checkbox',
              label: 'Lekcje online',
              defaultValue: false,
            },
            {
              name: 'lessonsInPerson',
              type: 'checkbox',
              label: 'Lekcje stacjonarne',
              defaultValue: false,
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Facebook',
              defaultValue: 'https://www.facebook.com/profile.php?id=100063812214369',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
              label: 'YouTube',
              defaultValue: 'https://www.youtube.com/@SzescStrun_JacekKrakowski',
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeading',
              type: 'textarea',
              label: 'Nagłówek hero',
              defaultValue: 'SZEŚĆ STRUN.\nNIESKOŃCZONE MOŻLIWOŚCI.',
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              label: 'Opis hero',
              defaultValue:
                'Odkryj świat gitary akustycznej i rozwijaj swoje umiejętności podczas indywidualnych lekcji.',
            },
            {
              name: 'heroCTA',
              type: 'text',
              label: 'Tekst głównego CTA',
              defaultValue: 'Umów lekcję',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoDefaultTitle',
              type: 'text',
              label: 'Domyślny tytuł SEO',
              defaultValue: 'Sześć Strun – Lekcje gitary akustycznej | Jacek Krakowski',
            },
            {
              name: 'seoDefaultDescription',
              type: 'textarea',
              label: 'Domyślny opis SEO',
              defaultValue:
                'Sześć Strun to indywidualne lekcje gitary akustycznej prowadzone przez Jacka Krakowskiego. Poznaj ofertę, rozwijaj umiejętności i umów lekcję.',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(['/', '/o-mnie', '/kontakt', '/oferta'], ['settings'])],
  },
}
