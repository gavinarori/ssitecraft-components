// Screenshot of a template. Until the publish script has produced real screenshots, a
// wireframe tinted from the slug stands in, so cards never render as empty boxes.

function hash(text) {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

function Wireframe({ slug }) {
  const hue = hash(slug) % 360
  const tint = `hsl(${hue} 70% 55%)`
  const soft = `hsl(${hue} 70% 55% / 0.14)`
  const bar = 'rounded-full bg-neutral-950/10'

  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-3 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-full" style={{ background: tint }} />
        <span className={`h-1.5 w-12 ${bar}`} />
        <span className="ml-auto flex gap-1.5">
          <span className={`h-1.5 w-6 ${bar}`} />
          <span className={`h-1.5 w-6 ${bar}`} />
          <span className="h-1.5 w-8 rounded-full" style={{ background: tint }} />
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg" style={{ background: soft }}>
        <span className={`h-2.5 w-2/3 ${bar}`} />
        <span className={`h-2.5 w-1/2 ${bar}`} />
        <span className="mt-1 h-4 w-16 rounded-md" style={{ background: tint }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((index) => (
          <span key={index} className="h-10 rounded-md bg-neutral-950/5" />
        ))}
      </div>
    </div>
  )
}

/**
 * variant "cover" fills a 16:10 frame. variant "tall" is the full-page capture and is meant to
 * sit inside a scrolling container, so it renders at natural height.
 */
export default function TemplateShot({ template, variant = 'cover', className = '' }) {
  const src = variant === 'tall' ? template.screenshots.tall : template.screenshots.cover

  if (variant === 'tall') {
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={`${template.title} full page`} loading="lazy" className={`block w-full ${className}`} />
    ) : (
      <div className={`relative aspect-[3/4] w-full ${className}`}>
        <Wireframe slug={template.slug} />
      </div>
    )
  }

  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${template.title} preview`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top transition-[object-position] duration-[1600ms] ease-in-out group-hover:object-[50%_12%]"
        />
      ) : (
        <Wireframe slug={template.slug} />
      )}
    </div>
  )
}
