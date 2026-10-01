import IconGithub from '@component/IconGithub'

// Before: the GitHub icon linked to buymeacoffee.com. It now links to the GitHub
// profile used in the footer. Point it at the repo URL if you prefer.
export default function GithubSocial() {
  return (
    <a
      href="https://github.com/gavinarori"
      rel="noreferrer noopener"
      target="_blank"
      className="grid size-9 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
    >
      <span className="sr-only">Sitecraft on GitHub</span>
      <IconGithub />
    </a>
  )
}