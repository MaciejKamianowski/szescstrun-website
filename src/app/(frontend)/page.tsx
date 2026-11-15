import type { Metadata } from 'next'

import { AboutPreview } from '@/components/sections/about-preview'
import { ContactCta } from '@/components/sections/contact-cta'
import { Hero } from '@/components/sections/hero'
import { OffersGrid } from '@/components/sections/offers-grid'
import { PostsGrid } from '@/components/sections/posts-grid'
import { PricingGrid } from '@/components/sections/pricing-grid'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { VideosGrid } from '@/components/sections/videos-grid'
import { WhySection } from '@/components/sections/why-section'
import { JsonLd } from '@/components/seo/json-ld'
import { resolveSiteLogo } from '@/lib/branding'
import { getMediaUrl } from '@/lib/media'
import {
  getActiveLessonOffers,
  getActivePricingPlans,
  getApprovedTestimonials,
  getFeaturedVideos,
  getLatestPosts,
  getSiteSettings,
} from '@/lib/queries'
import { SEO_DEFAULTS, buildMetadata, firstNonEmpty } from '@/lib/seo'
import {
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
} from '@/lib/structured-data'
import type { Media } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const logo = resolveSiteLogo(settings)
  const teacherPhoto = getMediaUrl(settings.teacherPhoto as Media | number | null | undefined)

  return buildMetadata({
    title: firstNonEmpty(settings.seoDefaultTitle, SEO_DEFAULTS.home.title),
    description: firstNonEmpty(settings.seoDefaultDescription, SEO_DEFAULTS.home.description),
    path: '/',
    image: teacherPhoto || logo.src,
  })
}

export default async function HomePage() {
  const [settings, offers, plans, videos, posts, testimonials] = await Promise.all([
    getSiteSettings(),
    getActiveLessonOffers(),
    getActivePricingPlans(),
    getFeaturedVideos(3),
    getLatestPosts(3),
    getApprovedTestimonials(),
  ])

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(settings),
          buildWebsiteJsonLd(settings),
          buildPersonJsonLd(settings),
        ]}
      />
      <Hero settings={settings} />
      <AboutPreview settings={settings} />
      <OffersGrid offers={offers} />
      <WhySection />
      <PricingGrid plans={plans} />
      <VideosGrid videos={videos} />
      <PostsGrid posts={posts} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactCta />
    </>
  )
}
