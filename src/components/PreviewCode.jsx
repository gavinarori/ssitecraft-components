import { useEffect, useRef } from 'react'

import Prism from 'prismjs'

import 'prismjs/components/prism-jsx.min'

const LANGUAGE_CLASS = {
  html: 'language-html',
  vue: 'language-html', // Vue templates highlight fine as markup
  jsx: 'language-jsx',
}

export default function PreviewCode({ showPreview, componentCode = '', codeType = 'html' }) {
  const codeRef = useRef(null)
  const languageClass = LANGUAGE_CLASS[codeType] ?? LANGUAGE_CLASS.html

  // Highlight only this block (not the whole page) whenever code or language changes.
  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current)
  }, [componentCode, languageClass])

  return (
    <div hidden={showPreview}>
      <pre
        tabIndex={0}
        className="h-[400px] overflow-auto rounded-xl p-4 font-mono text-sm leading-6 ring-1 ring-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 lg:h-[600px]"
      >
        {/* key forces a fresh node so Prism never works on stale, already-highlighted markup */}
        <code key={`${languageClass}-${componentCode.length}`} ref={codeRef} className={languageClass}>
          {componentCode}
        </code>
      </pre>
    </div>
  )
}