import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, adminsAndEditors } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { slugify } from '@/lib/utils'

export const LessonOffers: CollectionConfig = {
  slug: 'lesson-offers',
  labels: {
    singular: 'Oferta zajęć',
    plural: 'Oferta zajęć',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'displayOrder'],
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
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) return slugify(value)
            if (data?.title) return slugify(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      required: true,
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Ikona',
      defaultValue: 'music',
      options: [
        { label: 'Muzyka', value: 'music' },
        { label: 'Gitara', value: 'guitar' },
        { label: 'Uczeń', value: 'user' },
        { label: 'Cel', value: 'target' },
        { label: 'Książka', value: 'book' },
        { label: 'Gwiazda', value: 'star' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Obraz',
    },
    {
      name: 'targetAudience',
      type: 'text',
      label: 'Dla kogo',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Zakres',
      labels: {
        singular: 'Element',
        plural: 'Elementy',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          label: 'Element',
        },
      ],
    },
    {
      name: 'optionalPricingPlan',
      type: 'relationship',
      relationTo: 'pricing-plans',
      label: 'Powiązany plan cenowy',
      admin: {
        description: 'Opcjonalne powiązanie z pozycją cennika.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktywna',
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
    afterChange: [revalidateCollection(['/', '/oferta'], ['offers'])],
    afterDelete: [revalidateCollectionDelete(['/', '/oferta'], ['offers'])],
  },
}
