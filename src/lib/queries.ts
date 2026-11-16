import { draftMode } from 'next/headers'
import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type {
  LessonOffer,
  Page,
  Post,
  PricingPlan,
  SiteSetting,
  Testimonial,
  Video,
} from '@/payload-types'

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
    overrideAccess: false,
  })
})

export const getActiveLessonOffers = cache(async (): Promise<LessonOffer[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'lesson-offers',
    where: { active: { equals: true } },
    sort: 'displayOrder',
    depth: 1,
    limit: 50,
    overrideAccess: false,
  })
  return result.docs
})

export const getActivePricingPlans = cache(async (): Promise<PricingPlan[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pricing-plans',
    where: { active: { equals: true } },
    sort: 'displayOrder',
    depth: 0,
    limit: 50,
    overrideAccess: false,
  })
  return result.docs
})

export const getFeaturedVideos = cache(async (limit = 3): Promise<Video[]> => {
  const payload = await getPayloadClient()
  const featured = await payload.find({
    collection: 'videos',
    where: {
      and: [{ active: { equals: true } }, { featured: { equals: true } }],
    },
    sort: 'displayOrder',
    depth: 1,
    limit,
    overrideAccess: false,
  })

  if (featured.docs.length > 0) return featured.docs

  const fallback = await payload.find({
    collection: 'videos',
    where: { active: { equals: true } },
    sort: 'displayOrder',
    depth: 1,
    limit,
    overrideAccess: false,
  })
  return fallback.docs
})

export const getActiveVideos = cache(async (): Promise<Video[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'videos',
    where: { active: { equals: true } },
    sort: 'displayOrder',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })
  return result.docs
})

export const getLatestPosts = cache(async (limit = 3): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit,
    overrideAccess: false,
  })
  return result.docs
})

export const getPublishedPosts = cache(
  async ({
    page = 1,
    limit = 9,
    category,
  }: {
    page?: number
    limit?: number
    category?: string
  } = {}) => {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'posts',
      where: {
        and: [
          { _status: { equals: 'published' } },
          ...(category ? [{ category: { equals: category } }] : []),
        ],
      },
      sort: '-publishedAt',
      depth: 1,
      page,
      limit,
      overrideAccess: false,
    })
  },
)

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()

  // Draft preview requires Next.js draftMode cookie AND must never bypass access
  // without an authenticated Payload session. Public requests always see published only.
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        ...(isEnabled ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    depth: 2,
    limit: 1,
    draft: isEnabled,
    overrideAccess: false,
  })

  return result.docs[0] ?? null
})

export const getRelatedPosts = cache(async (post: Post, limit = 3): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { id: { not_equals: post.id } },
        { category: { equals: post.category } },
      ],
    },
    sort: '-publishedAt',
    depth: 1,
    limit,
    overrideAccess: false,
  })
  return result.docs
})

export const getActiveDownloads = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'downloads',
    where: { active: { equals: true } },
    sort: 'displayOrder',
    depth: 0,
    limit: 100,
    overrideAccess: false,
  })
  return result.docs
})

export const getApprovedTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'testimonials',
    where: { approved: { equals: true } },
    sort: 'displayOrder',
    depth: 0,
    limit: 20,
    overrideAccess: false,
  })
  return result.docs
})

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
})
