import { Fraunces, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import 'prismjs/themes/prism-okaidia.css'
import '@style/site.css'
import '@style/tokens.css'
import '@style/studio.css'

import Footer from '@component/Footer'
import Header from '@component/Header'

const SITE_URL = 'https://ssitecraft-components.vercel.app'
const SITE_NAME = 'Sitecraft'
const SITE_DESCRIPTION =
  'Free Tailwind CSS components to copy and paste, premium component packs, and complete website templates. Preview everything live before you take it.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Tailwind CSS components and website templates`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
  },
}

export const viewport = {
  themeColor: '#e9e6db',
  width: 'device-width',
  initialScale: 1,
}

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

// Display face for headlines: a soft, slightly wonky serif that gives the pages a hand-made feel
const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-display' })

export default function RootLayout({ children }) {
  return (
    <html className="h-full scroll-pt-20 scroll-smooth" lang="en" dir="ltr">
      <body
        className={`${inter.variable} ${fraunces.variable} flex min-h-screen flex-col bg-[#e9e6db] font-sans text-neutral-900 antialiased`}
      >
        <a
          href="#mainContent"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--lf-forest)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        <GoogleAnalytics gaId="G-V2JD5JTN42" />
      </body>
    </html>
  )
}
