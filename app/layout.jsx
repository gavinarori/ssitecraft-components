import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'

import 'prismjs/themes/prism-okaidia.css'
import '@style/site.css'


import Footer from '@component/Footer'
import Header from '@component/Header'

export const metadata = {
  metadataBase: new URL('https://ssitecraft-components.vercel.app'), 
  title: 'Welcome to Sitecraft Components',
  description: 'Copy paste the most trending components and use them in your websites without having to worry about starting from scratch.',
  openGraph: {
    title: 'Welcome to Sitecraft Components',
    description: 'Copy paste the most trending components and use them in your websites without having to worry about starting from scratch.',
    url: 'https://ssitecraft-components.vercel.app', 
    siteName: 'Sitecraft Components',
    type: 'website',
    images: ['https://ssitecraft-components.vercel.app/og-image.jpg'], 
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Sitecraft Components',
    description: 'Copy paste the most trending components and use them in your websites without having to worry about starting from scratch.',
  },
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html className="h-full scroll-pt-20 scroll-smooth" lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#mainContent"
          className="absolute left-1/2 z-[999] -translate-x-1/2 -translate-y-full bg-black px-6 py-3 text-white transition-transform focus:translate-y-0"
        >
          Skip to Main Content
        </a>

        <Header />

        <main className="bg-white">{children}</main>

        <Footer />


        <GoogleAnalytics gaId="" />
      </body>
    </html>
  )
}
