import { PageHeader, PageHeaderDescription, PageHeaderHeading } from './page-header'
import GradientGenerator from '@component/Generator'

export const metadata = {
  title: 'Tailwind CSS Gradient & Color Generator',
  description:
    'Explore every Tailwind CSS color in HSL, RGB and HEX, and build beautiful gradients you can copy in one click.',
}

export default function ColorsLayout({ children }) {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>Tailwind CSS Gradient &amp; Color Generator</PageHeaderHeading>
        <PageHeaderDescription>
          Create beautiful gradients and explore Tailwind CSS colors in HSL, RGB, and HEX formats.
          Customize, preview, and copy with ease for your next project.
        </PageHeaderDescription>
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <section aria-label="Gradient generator">
          <GradientGenerator />
        </section>

        <section id="colors" aria-label="Color palettes" className="scroll-mt-20">
          {children}
        </section>
      </div>
    </div>
  )
}
