import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, adminsAndEditors } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { extractYouTubeVideoId, isValidYouTubeUrl } from '@/lib/youtube'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: 'Nagranie',
    plural: 'Nagrania',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'active', 'displayOrder'],
    group: 'Treści',
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: activeOrAuthenticated,
    update: adminsAndEditors,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tytuł',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'Adres YouTube',
      required: true,
      validate: (value: string | null | undefined) => {
        if (typeof value !== 'string' || !isValidYouTubeUrl(value)) {
          return 'Podaj prawidłowy adres filmu YouTube.'
        }
        return true
      },
    },
    {
      name: 'youtubeVideoId',
      type: 'text',
      label: 'ID filmu YouTube',
      admin: {
        readOnly: true,
        description: 'Wypełniane automatycznie na podstawie adresu URL.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.youtubeUrl) {
              return extractYouTubeVideoId(data.youtubeUrl) || undefined
            }
            return undefined
          },
        ],
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Miniatura (opcjonalna)',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategoria',
      defaultValue: 'nagranie',
      options: [
        { label: 'Nagranie', value: 'nagranie' },
        { label: 'Lekcja', value: 'lekcja' },
        { label: 'Występ', value: 'wystep' },
        { label: 'Inne', value: 'inne' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Wyróżnione na stronie głównej',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktywne',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection(['/', '/nagrania'], ['videos'])],
    afterDelete: [revalidateCollectionDelete(['/', '/nagrania'], ['videos'])],
  },
}
