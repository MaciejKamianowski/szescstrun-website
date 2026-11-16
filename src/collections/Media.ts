import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { adminsAndEditors, anyone } from '@/access'
import { IMAGE_FORMAT_LABEL, IMAGE_MIME_TYPES, IMAGE_SIZE_LABEL, validateImageUpload } from '@/lib/uploads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Plik mediów',
    plural: 'Media',
  },
  admin: {
    group: 'Pliki',
    description: `Zdjęcia do strony. Dozwolone formaty: ${IMAGE_FORMAT_LABEL}. Maksymalny rozmiar: ${IMAGE_SIZE_LABEL}. Po przesłaniu uzupełnij tekst alternatywny i kliknij Zapisz. Zdjęć HEIC z iPhone’a użyj dopiero po zapisaniu ich jako JPG.`,
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: anyone,
    update: adminsAndEditors,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const message = validateImageUpload({
            mimetype: req.file.mimetype,
            size: req.file.size,
            name: req.file.name,
          })
          if (message) throw new Error(message)
        }
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: [...IMAGE_MIME_TYPES],
    crop: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: {
        quality: 82,
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Tekst alternatywny',
      required: true,
      admin: {
        description: `Opis obrazu dla osób, które go nie widzą, i dla wyszukiwarek. Dozwolone formaty: ${IMAGE_FORMAT_LABEL}. Maksymalny rozmiar: ${IMAGE_SIZE_LABEL}.`,
      },
    },
  ],
}
