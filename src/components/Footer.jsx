import Link from 'next/link'

import Container from '@component/Container'
import BrandLogo from '@component/BrandLogo'

export default function Footer() {
  const menuLinks = [
    {
      title: 'FAQs',
      href: '/about/faqs',
    },
    {
      title: 'Acknowledgements',
      href: '/about/acknowledgements',
    },
  ]

  return (
    <footer className="border-t border-gray-200 bg-white ">
      <Container classNames="py-4 lg:py-12">
        <BrandLogo fontSize="text-lg" />

        <div className="mt-6 ml-2">
          <div className="mt-4 lg:flex lg:items-end lg:justify-between">
            <p className="mt-4 text-sm text-gray-700 lg:mt-0">
              Created by{' '}
              <a
                href="https://github.com/gavinarori"
                rel="noreferrer"
                target="_blank"
                className="inline-block font-medium hover:text-gray-900"
              >
                Gavin Arori 
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
