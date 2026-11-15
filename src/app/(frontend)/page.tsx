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
import {
  getActiveLessonOffers,
  getActivePricingPlans,
  getApprovedTestimonials,
  getFeaturedVideos,
  getLatestPosts,
  getSiteSettings,
} from '@/lib/queries'
import { getServerUrl } from '@/lib/utils'

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
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.siteName || 'Sześć Strun',
            url: getServerUrl(),
            description: settings.siteDescription || undefined,
            inLanguage: 'pl-PL',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: settings.teacherName || 'Jacek Krakowski',
            url: `${getServerUrl()}/o-mnie`,
            jobTitle: 'Nauczyciel gry na gitarze akustycznej',
            sameAs: [settings.facebookUrl, settings.youtubeUrl].filter(Boolean),
          },
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
