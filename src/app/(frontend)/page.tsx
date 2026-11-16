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
import { resolveAboutPreview, resolveRecordingsCopy, resolveWhySection, shouldShowHomeRecordings, type SiteContentSettings } from '@/lib/site-content'
import {
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
} from '@/lib/structured-data'
import type { Media } from '@/payload-types'
import { SEO_DEFAULTS, buildMetadata, firstNonEmpty } from '@/lib/seo'

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

  const content = settings as typeof settings & SiteContentSettings
  const about = resolveAboutPreview(content)
  const why = resolveWhySection(content)
  const recordings = resolveRecordingsCopy(content)

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
      {about ? <AboutPreview content={about} /> : null}
      <OffersGrid offers={offers} />
      {why ? <WhySection content={why} /> : null}
      <PricingGrid plans={plans} />
      {shouldShowHomeRecordings(recordings, videos.length > 0) ? (
        <VideosGrid
          videos={videos}
          eyebrow={recordings.eyebrow}
          title={recordings.title}
          description={recordings.description}
          buttonLabel={recordings.buttonLabel}
          buttonHref={recordings.buttonHref}
          buttonExternal={recordings.buttonExternal}
          emptyMessage={recordings.emptyMessage}
        />
      ) : null}
      <PostsGrid posts={posts} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactCta />
    </>
  )
}
