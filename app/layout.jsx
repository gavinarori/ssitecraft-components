import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from "./themeprovider"
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
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >

        <Header />

        <main className="bg-white">{children}</main>

        <Footer />
        </ThemeProvider>

        <GoogleAnalytics gaId="G-V2JD5JTN42" />
      </body>
    </html>
  )
}
