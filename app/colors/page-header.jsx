import { cn } from '@util/cn'

function PageHeader({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'sc-glow relative border-b border-slate-200 px-6 py-10 md:py-14 lg:py-16',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3">{children}</div>
    </section>
  )
}

function PageHeaderHeading({ className, ...props }) {
  return (
    <h1
      className={cn(
        'text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:leading-[1.1]',
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }) {
  return (
    <p
      className={cn('max-w-2xl text-balance text-lg leading-8 text-slate-600', className)}
      {...props}
    />
  )
}

function PageActions({ className, ...props }) {
  return (
    <div
      className={cn('flex w-full flex-wrap items-center justify-start gap-3 pt-2', className)}
      {...props}
    />
  )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
