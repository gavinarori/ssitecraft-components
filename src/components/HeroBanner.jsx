import HeaderSearch from '@component/HeaderSearch'
import Container from '@component/Container'

export default function HeroBanner() {
  return (
    <section className=" bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2]  text-center">
      <Container classNames="py-0 lg:py-0">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
          <div className="mb-4">
              <p className="inline-flex items-center text-black justify-center whitespace-nowrap rounded-full bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm shadow-black/[.12] dark:bg-accent">
                <span className="mr-3 flex shrink-0 border-r border-border pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
                    <path
                      className="fill-zinc-500"
                      fillRule="evenodd"
                      d="M10.958.713a1 1 0 0 0-1.916 0l-.999 3.33-3.33 1a1 1 0 0 0 0 1.915l3.33.999 1 3.33a1 1 0 0 0 1.915 0l.999-3.33 3.33-1a1 1 0 0 0 0-1.915l-3.33-.999-.999-3.33Z"
                      clipRule="evenodd"
                    />
                    <path
                      className="fill-zinc-400"
                      d="m4.365 11.31.079.212.212.08 1.68.635a.256.256 0 0 1 .164.24.256.256 0 0 1-.163.238l-1.68.635-.213.08-.08.213-.63 1.692v.001a.25.25 0 0 1-.234.164.25.25 0 0 1-.233-.164l-.631-1.693-.08-.213-.212-.08-1.68-.635a.256.256 0 0 1-.164-.239c0-.108.067-.203.163-.24l1.68-.634.213-.08.08-.213.63-1.692c.018-.046.083-.117.234-.117.15 0 .217.07.233.116v.001l.632 1.692Z"
                    />
                  </svg>
                </span>
                New components every week
              </p>
            </div>
            <div className="flex flex-col items-center  space-y-4 text-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <div className="space-y-2">
                <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Sitecraft Components
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl ">
                Copy paste the most trending components and use them in your websites without having to worry about starting from scratch.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center text-sm font-medium text-slate-500 ">
                  <svg className="h-8 w-8 flex-none stroke-current text-slate-400" 
                  fill="none" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round">
                    <path d="M5 4.15h22.5l-2 20.5-9.25 4-9.25-4-2-20.5Z"></path>
                    <path d="M20.5 9.15H12v5.5h8.5v6l-4.25 2-4.25-2v-2.5"></path>
                  </svg>
                  <span className="ml-2.5">HTML</span>
                </div>
                <div className="flex items-center text-sm font-medium text-slate-500 ">
                  <svg className="h-8 w-8 flex-none stroke-current text-slate-400" 
                  fill="none" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round">
                    <ellipse cx="16" cy="16" rx="13" ry="5"></ellipse>
                    <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)"></ellipse>
                    <ellipse rx="13" ry="5" transform="matrix(-.5 .86603 .86603 .5 16 16)"></ellipse>
                    <circle cx="16" cy="16" r="2"></circle>
                  </svg>
                  <span className="ml-2.5">React</span>
                </div>
                <div className="flex items-center text-sm font-medium text-slate-500 ">
                  <svg className="h-8 w-8 flex-none stroke-current text-slate-400" 
                  fill="none" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round">
                    <path d="M19.924 5 16 11.644 12.075 5H3l13 23L29 5h-9.076Z"></path><path d="M19.879 5 16 11.26 12.121 5H8l8 13 8-13h-4.121Z"></path>
                    </svg>
                  <span className="ml-2.5">Vue</span>
                </div>
                
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
