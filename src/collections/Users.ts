import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors, adminsField } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Użytkownik',
    plural: 'Użytkownicy',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'active'],
    group: 'Administracja',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: admins,
    delete: admins,
    read: adminsAndEditors,
    update: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Imię i nazwisko',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rola',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Edytor', value: 'editor' },
      ],
      access: {
        create: adminsField,
        update: adminsField,
      },
      admin: {
        description: 'Administrator ma pełne uprawnienia. Edytor zarządza treściami.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Konto aktywne',
      defaultValue: true,
      access: {
        create: adminsField,
        update: adminsField,
      },
    },
  ],
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        if (user && 'active' in user && user.active === false) {
          throw new Error('Konto użytkownika jest nieaktywne.')
        }
      },
    ],
  },
}
