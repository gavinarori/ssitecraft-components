import { Inter, IBM_Plex_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import 'prismjs/themes/prism-okaidia.css'
import '@style/site.css'
// Hero + design-token styles. Imported here so they load even if site.css doesn't @import them
// (importing twice is harmless; remove one of the two if you like).
import '@style/tokens.css'

import Footer from '@component/Footer'
import Header from '@component/Header'

const SITE_URL = 'https://ssitecraft-components.vercel.app'
const SITE_NAME = 'Sitecraft Components'
const SITE_DESCRIPTION =
  'Copy-paste Tailwind CSS components in HTML, React and Vue. Preview each one, resize it, and ship faster.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Tailwind CSS UI components`,
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
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html className="h-full scroll-pt-20 scroll-smooth" lang="en" dir="ltr">
      <body
        className={`${inter.variable} ${plexMono.variable} flex min-h-screen flex-col bg-white font-sans text-neutral-950 antialiased selection:bg-sky-100 selection:text-sky-950`}
      >
        <a
          href="#mainContent"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-neutral-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <Header />

        {/* Hatched gutters appear beside the framed column on wide screens */}
        <main className="sc-hatch flex-1">
          <div className="mx-auto min-h-full max-w-screen-xl bg-white xl:border-x xl:border-neutral-950/10">
            {children}
          </div>
        </main>

        <Footer />

        <GoogleAnalytics gaId="G-V2JD5JTN42" />
      </body>
    </html>
  )
}