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
import { buildMetadata } from '@/lib/seo'
import { getServerUrl } from '@/lib/utils'

import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = resolveFaviconUrl(settings)
  const logo = resolveSiteLogo(settings)
  const base = buildMetadata({
    title: settings.seoDefaultTitle,
    description: settings.seoDefaultDescription,
    path: '/',
    image: logo.src,
  })

  return {
    ...base,
    metadataBase: new URL(getServerUrl()),
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

  return (
    <html lang="pl" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Header ctaLabel={settings.heroCTA || 'Umów lekcję'} logo={logo} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
