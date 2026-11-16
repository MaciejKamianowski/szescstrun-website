import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import {
  DEFAULT_APPLE_ICON,
  DEFAULT_ICON_192,
  DEFAULT_ICON_512,
  resolveFaviconUrl,
  resolveSiteLogo,
} from '@/lib/branding'
import { getSiteSettings } from '@/lib/queries'
import { resolveMenuCta, resolveNavigation, type SiteContentSettings } from '@/lib/site-content'
import { SEO_DEFAULTS, firstNonEmpty, getMetadataBase } from '@/lib/seo'

import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = resolveFaviconUrl(settings)

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: firstNonEmpty(settings.seoDefaultTitle, SEO_DEFAULTS.home.title)!,
      template: '%s',
    },
    description: firstNonEmpty(
      settings.seoDefaultDescription,
      SEO_DEFAULTS.home.description,
    ),
    icons: {
      icon: [
        { url: '/icons/favicon-16.png', type: 'image/png', sizes: '16x16' },
        { url: favicon, type: 'image/png', sizes: '32x32' },
        { url: DEFAULT_ICON_192, type: 'image/png', sizes: '192x192' },
        { url: DEFAULT_ICON_512, type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: DEFAULT_APPLE_ICON, sizes: '180x180', type: 'image/png' }],
      shortcut: favicon,
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const logo = resolveSiteLogo(settings)
  const content = settings as typeof settings & SiteContentSettings

  return (
    <html lang="pl" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Header items={resolveNavigation(content.navigation)} cta={resolveMenuCta(content)} logo={logo} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
