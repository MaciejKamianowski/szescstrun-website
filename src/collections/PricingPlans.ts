import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, adminsAndEditors } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { slugify } from '@/lib/utils'

export const PricingPlans: CollectionConfig = {
  slug: 'pricing-plans',
  labels: {
    singular: 'Oferta cenowa',
    plural: 'Cennik',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'priceAmount', 'active', 'displayOrder'],
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
      name: 'name',
      type: 'text',
      label: 'Nazwa',
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
            if (data?.name) return slugify(data.name)
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Typ',
      required: true,
      defaultValue: 'single',
      options: [
        { label: 'Pojedyncza lekcja', value: 'single' },
        { label: 'Karnet / pakiet', value: 'package' },
        { label: 'Inne', value: 'other' },
      ],
    },
    {
      name: 'durationMinutes',
      type: 'number',
      label: 'Czas lekcji (minuty)',
      min: 1,
      admin: {
        description: 'Czas trwania pojedynczej lekcji w minutach.',
      },
    },
    {
      name: 'lessonCount',
      type: 'number',
      label: 'Liczba lekcji',
      min: 1,
      admin: {
        description: 'Dla karnetów — liczba lekcji w pakiecie.',
        condition: (_, siblingData) => siblingData?.type === 'package',
      },
    },
    {
      name: 'priceAmount',
      type: 'number',
      label: 'Cena (grosze)',
      required: true,
      min: 0,
      admin: {
        description: 'Kwota w groszach. Przykład: 12000 = 120,00 zł.',
      },
      validate: (value: number | null | undefined) => {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
          return 'Podaj nieujemną liczbę całkowitą w groszach.'
        }
        return true
      },
    },
    {
      name: 'currency',
      type: 'select',
      label: 'Waluta',
      required: true,
      defaultValue: 'PLN',
      options: [{ label: 'PLN', value: 'PLN' }],
    },
    {
      name: 'promotionalPriceAmount',
      type: 'number',
      label: 'Cena promocyjna (grosze)',
      min: 0,
      admin: {
        description: 'Opcjonalna cena promocyjna w groszach.',
      },
      validate: (
        value: number | null | undefined,
        { siblingData }: { siblingData: { priceAmount?: number } },
      ) => {
        if (value === undefined || value === null) return true
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
          return 'Podaj nieujemną liczbę całkowitą w groszach.'
        }
        if (typeof siblingData?.priceAmount === 'number' && value >= siblingData.priceAmount) {
          return 'Cena promocyjna musi być niższa od ceny regularnej.'
        }
        return true
      },
    },
    {
      name: 'validityDays',
      type: 'number',
      label: 'Ważność (dni)',
      min: 1,
      admin: {
        description: 'Opcjonalny termin ważności karnetu w dniach.',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Cechy oferty',
      labels: {
        singular: 'Cecha',
        plural: 'Cechy',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          label: 'Cecha',
        },
      ],
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      label: 'Wyróżniona oferta',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktywna (widoczna publicznie)',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Kolejność wyświetlania',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'additionalNotes',
      type: 'textarea',
      label: 'Dodatkowe uwagi',
    },
  ],
  hooks: {
    afterChange: [revalidateCollection(['/', '/cennik', '/oferta'], ['pricing'])],
    afterDelete: [revalidateCollectionDelete(['/', '/cennik', '/oferta'], ['pricing'])],
  },
}
