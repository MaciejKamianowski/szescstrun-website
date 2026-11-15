import type { CollectionConfig } from 'payload'

import { adminsAndEditors, approvedOrAuthenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Opinia',
    plural: 'Opinie uczniów',
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'approved', 'displayOrder'],
    group: 'Treści',
    description: 'Wyświetlane są wyłącznie zatwierdzone opinie. Nie dodawaj fikcyjnych treści.',
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: approvedOrAuthenticated,
    update: adminsAndEditors,
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      label: 'Imię autora',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Treść opinii',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Zatwierdzona',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Tylko zatwierdzone opinie pojawiają się na stronie.',
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
    afterChange: [revalidateCollection(['/', '/o-mnie'], ['testimonials'])],
    afterDelete: [revalidateCollectionDelete(['/', '/o-mnie'], ['testimonials'])],
  },
}
