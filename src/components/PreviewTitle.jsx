export default function PreviewTitle({ componentTitle, componentHash }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
      <a
        href={`#${componentHash}`}
        className="group relative inline-flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <span>{componentTitle}</span>
        <span
          aria-hidden="true"
          className="text-indigo-500 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          #
        </span>
      </a>
    </h2>
  )
}