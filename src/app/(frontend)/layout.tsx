import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { getServerUrl } from '@/lib/utils'

import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: settings.seoDefaultTitle,
    description: settings.seoDefaultDescription,
    path: '/',
  })
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="pl" className={GeistSans.variable}>
      <head>
        <link rel="canonical" href={getServerUrl()} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header ctaLabel={settings.heroCTA || 'Umów lekcję'} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
