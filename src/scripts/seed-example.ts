/**
 * Opcjonalny seed danych strukturalnych (NIE prawdziwe opinie / ogłoszenia).
 * Uruchom: pnpm seed
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  const existingOffers = await payload.find({
    collection: 'lesson-offers',
    limit: 1,
  })

  if (existingOffers.totalDocs > 0) {
    payload.logger.info('Seed pominięty — dane przykładowe już istnieją.')
    process.exit(0)
  }

  const offers = [
    {
      title: 'Nauka od podstaw',
      slug: 'nauka-od-podstaw',
      description:
        'Pierwsze kroki z gitarą akustyczną: postawa, podstawowe akordy, rytm i proste utwory.',
      icon: 'book' as const,
      targetAudience: 'Początkujący',
      features: [
        { feature: 'Podstawy techniki' },
        { feature: 'Czytanie chwytów' },
        { feature: 'Prosty repertuar' },
      ],
      active: true,
      displayOrder: 1,
    },
    {
      title: 'Rozwój techniki gitarowej',
      slug: 'rozwoj-techniki-gitarowej',
      description:
        'Praca nad precyzją, dźwiękiem i płynnością — dla osób, które już grają i chcą iść dalej.',
      icon: 'target' as const,
      targetAudience: 'Średnio zaawansowani',
      features: [{ feature: 'Technika prawej i lewej ręki' }, { feature: 'Ćwiczenia brzmieniowe' }],
      active: true,
      displayOrder: 2,
    },
    {
      title: 'Indywidualne lekcje gry na gitarze',
      slug: 'indywidualne-lekcje',
      description:
        'Program dopasowany do Twoich celów: utwory, styl i tempo nauki ustalamy wspólnie.',
      icon: 'user' as const,
      targetAudience: 'Wszystkie poziomy',
      features: [{ feature: 'Elastyczny plan' }, { feature: 'Repertuar na zamówienie' }],
      active: true,
      displayOrder: 3,
    },
  ]

  for (const offer of offers) {
    await payload.create({
      collection: 'lesson-offers',
      data: offer,
      context: { disableRevalidate: true },
    })
  }

  await payload.create({
    collection: 'pricing-plans',
    data: {
      name: 'Lekcja 45 minut (przykład struktury)',
      slug: 'lekcja-45-minut-przyklad',
      description: 'Przykładowa pozycja cennika — ustaw realną cenę w CMS.',
      type: 'single',
      durationMinutes: 45,
      priceAmount: 0,
      currency: 'PLN',
      active: false,
      displayOrder: 1,
      additionalNotes: 'Ukryte domyślnie. Ustaw cenę i aktywuj przed publikacją.',
    },
    context: { disableRevalidate: true },
  })

  await payload.create({
    collection: 'pricing-plans',
    data: {
      name: 'Karnet 4 lekcji (przykład struktury)',
      slug: 'karnet-4-lekcji-przyklad',
      description: 'Przykładowy karnet — liczba lekcji i cena do edycji.',
      type: 'package',
      durationMinutes: 60,
      lessonCount: 4,
      priceAmount: 0,
      currency: 'PLN',
      validityDays: 60,
      active: false,
      displayOrder: 2,
      additionalNotes: 'Ukryte domyślnie. Nie jest to rzeczywista oferta cenowa.',
    },
    context: { disableRevalidate: true },
  })

  payload.logger.info('Seed przykładowy zakończony. Cennik jest nieaktywny do czasu edycji.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
