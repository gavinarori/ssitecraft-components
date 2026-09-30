import { useEffect, useRef, useState } from 'react'
import { CheckIcon, ClipboardIcon, XIcon } from 'lucide-react'

const CODE_TYPE_LABEL = {
  html: 'HTML',
  jsx: 'JSX',
  vue: 'Vue',
}

const LABEL = { idle: 'Copy', copied: 'Copied', error: 'Failed' }

export default function PreviewCopy({ codeType, componentCode = '' }) {
  const [status, setStatus] = useState('idle')
  const timeoutRef = useRef(null)

  // Don't leave a pending timer behind if the component unmounts.
  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  async function handleCopy() {
    clearTimeout(timeoutRef.current)

    try {
      await navigator.clipboard.writeText(componentCode)
      setStatus('copied')
    } catch {
      setStatus('error')
    }

    timeoutRef.current = setTimeout(() => setStatus('idle'), 2500)
  }

  const Icon = status === 'copied' ? CheckIcon : status === 'error' ? XIcon : ClipboardIcon
  const typeLabel = CODE_TYPE_LABEL[codeType] ?? 'code'

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        status === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : status === 'error'
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700'
      }`}
    >
      <span className="sr-only">Copy {typeLabel}</span>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span aria-live="polite">{LABEL[status]}</span>
    </button>
  )
}