import IconGithub from '@component/IconGithub'

export default function GithubSocial({ tone = 'dark' }) {
  return (
    <a
      href="https://github.com/gavinarori"
      rel="noreferrer noopener"
      target="_blank"
      className={`lf-focus grid size-9 place-items-center rounded-lg ${tone === 'light' ? 'text-white hover:bg-white/15' : 'text-neutral-700 hover:bg-[rgb(12_42_30/0.05)] hover:text-[var(--lf-forest)]'} `}
    >
      <span className="sr-only">Sitecraft on GitHub</span>
      <IconGithub />
    </a>
  )
}
