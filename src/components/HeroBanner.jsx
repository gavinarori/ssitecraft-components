import HeaderSearch from '@component/HeaderSearch'
import Container from '@component/Container'

export default function HeroBanner() {
  return (
    <section className=" bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]  text-center">
      <Container classNames="py-0 lg:py-0">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center  space-y-4 text-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Sitecraft Components
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl ">
                Copy paste the most trending components and use them in your websites without having to worry about starting from scratch.
                </p>
              </div>
              <div className="space-x-4">
                <HeaderSearch/>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4">
        </div>
      </Container>
    </section>
  )
}
