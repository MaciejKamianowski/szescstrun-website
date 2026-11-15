import type { CollectionConfig } from 'payload'

import { adminsAndEditors, anyone } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { slugify } from '@/lib/utils'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Strona',
    plural: 'Strony informacyjne',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Treści',
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: anyone,
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
        description: 'Np. polityka-prywatnosci',
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
      name: 'content',
      type: 'richText',
      label: 'Treść',
      required: true,
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection(['/polityka-prywatnosci'], ['pages'])],
    afterDelete: [revalidateCollectionDelete(['/polityka-prywatnosci'], ['pages'])],
  },
}
