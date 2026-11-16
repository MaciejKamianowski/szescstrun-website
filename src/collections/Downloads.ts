import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { activeOrAuthenticated, adminsAndEditors } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { validateDownloadUpload } from '@/lib/uploads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: {
    singular: 'Materiał do pobrania',
    plural: 'Materiały do pobrania',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'active', 'displayOrder'],
    group: 'Treści',
    description:
      'Pliki PDF i inne materiały na podstronie „Do pobrania”. Na stronie widać tylko pozycje z zaznaczonym „Aktywny”.',
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: activeOrAuthenticated,
    update: adminsAndEditors,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const message = validateDownloadUpload({
            mimetype: req.file.mimetype,
            size: req.file.size,
            name: req.file.name,
          })
          if (message) throw new Error(message)
        }
      },
    ],
    beforeValidate: [
      ({ data, req, operation }) => {
        if (operation !== 'create' || !data || (typeof data.title === 'string' && data.title.trim())) {
          return data
        }
        const fromFile = req.file?.name?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
        if (fromFile) data.title = fromFile
        return data
      },
    ],
    afterChange: [revalidateCollection(['/do-pobrania'], ['downloads'])],
    afterDelete: [revalidateCollectionDelete(['/do-pobrania'], ['downloads'])],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../downloads'),
    mimeTypes: [
      'application/pdf',
      'application/zip',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    crop: false,
    focalPoint: false,
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
      admin: {
        description: 'Krótko napisz, co jest w pliku. Opis pojawia się obok przycisku pobierania.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktywny',
      defaultValue: true,
      admin: {
        description: 'Aktywna — określa, czy element jest widoczny na stronie.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
      admin: {
        description: 'Mniejsza liczba oznacza wyższą pozycję na liście.',
        position: 'sidebar',
      },
    },
  ],
}
