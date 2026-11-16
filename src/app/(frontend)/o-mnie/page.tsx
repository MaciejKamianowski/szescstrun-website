import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/rich-text'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { JsonLd } from '@/components/seo/json-ld'
import { getApprovedTestimonials, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { resolveAboutPage, type SiteContentSettings } from '@/lib/site-content'
import { buildOrganizationJsonLd, buildPersonJsonLd } from '@/lib/structured-data'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const about = resolveAboutPage(settings as typeof settings & SiteContentSettings)

  return buildMetadata({
    title: about.seoTitle,
    description: about.seoDescription,
    path: '/o-mnie',
  })
}

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([getSiteSettings(), getApprovedTestimonials()])
  const about = resolveAboutPage(settings as typeof settings & SiteContentSettings)

  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(settings), buildPersonJsonLd(settings)]} />
      <section className="border-b border-border py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading as="h1" eyebrow={about.eyebrow} title={about.title} description={about.intro} />
          </Reveal>

          {about.photo ? (
            <Reveal delay={0.05} className="relative mt-10 aspect-[16/10] overflow-hidden">
              <Image
                src={about.photo.src}
                alt={about.photo.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </Reveal>
          ) : null}

          <Reveal delay={0.08} className="mt-10">
            {about.biography ? (
              <RichText data={about.biography} />
            ) : (
              <div className="space-y-4 text-base leading-relaxed text-muted">
                {about.biographyFallback.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </Reveal>

          {about.experience ? (
            <Reveal delay={0.1} className="mt-12">
              <h2 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                {about.experienceHeading}
              </h2>
              <RichText data={about.experience} className="mt-4" />
            </Reveal>
          ) : null}

          {about.method ? (
            <Reveal delay={0.12} className="mt-12">
              <h2 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                {about.methodHeading}
              </h2>
              <RichText data={about.method} className="mt-4" />
            </Reveal>
          ) : null}

          {about.sections.map((section) => (
            <Reveal key={section.id} className="mt-12">
              {section.heading ? (
                <h2 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                  {section.heading}
                </h2>
              ) : null}
              {section.body ? <RichText data={section.body} className="mt-4" /> : null}
            </Reveal>
          ))}

          {about.gallery.length > 0 ? (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {about.gallery.map((item) => (
                <figure key={item.id}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  {item.caption ? <figcaption className="mt-2 text-sm text-muted">{item.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}

          {about.buttons.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-3">
              {about.buttons.map((button) =>
                button.external ? (
                  <a
                    key={button.id}
                    href={button.href}
                    className={cn(buttonVariants({ variant: 'secondary' }))}
                    target={button.openInNewTab ? '_blank' : undefined}
                    rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {button.label}
                  </a>
                ) : (
                  <Link key={button.id} href={button.href} className={cn(buttonVariants({ variant: 'secondary' }))}>
                    {button.label}
                  </Link>
                ),
              )}
            </div>
          ) : null}
        </Container>
      </section>
      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
