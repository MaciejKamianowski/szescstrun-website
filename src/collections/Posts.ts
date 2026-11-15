import type { CollectionConfig } from 'payload'

import { adminsAndEditors, publishedOrAuthenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { slugify } from '@/lib/utils'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Wpis',
    plural: 'Aktualności',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'pinned'],
    group: 'Treści',
    preview: (doc) => {
      if (doc?.slug) return `/aktualnosci/${doc.slug}`
      return '/aktualnosci'
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 25,
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: publishedOrAuthenticated,
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
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Adres URL wpisu. Generowany automatycznie, można poprawić ręcznie.',
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
      name: 'excerpt',
      type: 'textarea',
      label: 'Zajawka',
      required: true,
      maxLength: 300,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Treść',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie główne',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeria',
      labels: {
        singular: 'Zdjęcie',
        plural: 'Zdjęcia',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Zdjęcie',
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategoria',
      required: true,
      defaultValue: 'aktualnosci',
      options: [
        { label: 'Aktualności', value: 'aktualnosci' },
        { label: 'Ogłoszenia', value: 'ogloszenia' },
        { label: 'Warsztaty', value: 'warsztaty' },
        { label: 'Wydarzenia', value: 'wydarzenia' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data publikacji',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'pinned',
      type: 'checkbox',
      label: 'Przypięte ogłoszenie',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autor',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'Tytuł SEO',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'Opis SEO',
      maxLength: 160,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data?._status === 'published' && !data.publishedAt) {
            data.publishedAt = new Date().toISOString()
          }
        }
        return data
      },
    ],
    afterChange: [revalidateCollection(['/', '/aktualnosci'], ['posts'])],
    afterDelete: [revalidateCollectionDelete(['/', '/aktualnosci'], ['posts'])],
  },
}
