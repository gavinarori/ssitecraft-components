import IconGithub from '@component/IconGithub'

export default function PreviewCreator({ creatorGithub }) {
  if (!creatorGithub) return null

  return (
    <p className="text-sm text-slate-600">
      <span className="sr-only">Created by </span>
      <a
        href={`https://github.com/${creatorGithub}`}
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 font-medium text-slate-700 no-underline shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
      >
        {/* Plain <img>: GitHub avatars are external and decorative */}
        <img
          src={`https://github.com/${creatorGithub}.png?size=48`}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          className="size-5 rounded-full bg-slate-100"
        />
        <span>{creatorGithub}</span>
        <IconGithub className="size-3.5 text-slate-400 transition group-hover:text-indigo-600" />
      </a>
    </p>
  )
}