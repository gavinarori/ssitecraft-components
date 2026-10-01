import { useEffect, useRef, useState } from 'react'

import { useInView } from 'react-intersection-observer'

import { componentPreviewHtml, componentPreviewJsx, componentPreviewVue } from '@util/transformers'

import PreviewBreakpoint from '@component/PreviewBreakpoint'
import PreviewCode from '@component/PreviewCode'
import PreviewCopy from '@component/PreviewCopy'
import PreviewIframe from '@component/PreviewIframe'
import PreviewInteractive from '@component/PreviewInteractive'
import PreviewType from '@component/PreviewType'
import PreviewView from '@component/PreviewView'

export default function ComponentPreview({ componentData, componentContainer }) {
  const refIframe = useRef(null)

  const [codeType, setCodeType] = useState('html')
  const [sources, setSources] = useState({ html: '', jsx: '', vue: '', raw: '' })
  const [isDarkMode] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [previewWidth, setPreviewWidth] = useState('100%')
  const [showPreview, setShowPreview] = useState(true)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error

  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true })

  const {
    id: componentId,
    title: componentTitle,
    slug: componentSlug,
    category: componentCategory,
    container: componentSpace,
    dark: componentHasDark,
    interactive: componentHasInteractive,
  } = componentData

  const trueComponentContainer = componentSpace || componentContainer?.previewInner
  const componentWrapper = componentContainer?.previewHeight || 'h-[400px] lg:h-[600px]'
  const componentHash = `component-${componentId}`

  // One effect replaces the three overlapping ones (fetch on view, fetch on toggle,
  // and a mount-time transform that ran on empty code). It also cancels stale requests.
  useEffect(() => {
    if (!inView) return

    const controller = new AbortController()
    const useDarkMode = Boolean(componentHasDark && isDarkMode)
    const useInteractiveMode = Boolean(componentHasInteractive && isInteractive)

    const componentPath = [componentId, useDarkMode && 'dark', useInteractiveMode && 'interactive']
      .filter(Boolean)
      .join('-')
    const componentUrl = `/components/${componentCategory}-${componentSlug}/${componentPath}.html`

    setStatus((current) => (current === 'ready' ? current : 'loading'))

    fetch(componentUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${componentUrl}`)
        return response.text()
      })
      .then((text) => {
        setSources({
          raw: text,
          html: componentPreviewHtml(text, trueComponentContainer, useDarkMode),
          jsx: componentPreviewJsx(text),
          vue: componentPreviewVue(text),
        })
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [
    inView,
    isDarkMode,
    isInteractive,
    componentId,
    componentCategory,
    componentSlug,
    componentHasDark,
    componentHasInteractive,
    trueComponentContainer,
  ])

  // Derived, not state: the code shown follows the selected language automatically
  const previewCode = codeType === 'jsx' ? sources.jsx : codeType === 'vue' ? sources.vue : sources.raw

  return (
    <div ref={ref} id={componentHash} className="scroll-mt-24">
      <div className="space-y-4">
        <div className="lg:flex lg:items-center">
          {status === 'ready' && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <PreviewView handleSetShowPreview={setShowPreview} />

              <PreviewType
                componentId={componentId}
                codeType={codeType}
                handleSetCodeType={setCodeType}
              />

              <PreviewCopy componentCode={previewCode} codeType={codeType} />

              {componentHasInteractive && (
                <PreviewInteractive
                  isInteractive={isInteractive}
                  handleSetIsInteractive={setIsInteractive}
                />
              )}
            </div>
          )}

          <div className="hidden lg:flex lg:flex-1 lg:items-end lg:justify-end lg:gap-4">
            <PreviewBreakpoint handleSetPreviewWidth={setPreviewWidth} />
          </div>
        </div>

        <div className="relative">
          {status === 'error' ? (
            <div
              role="alert"
              className={`grid place-items-center rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 ${componentWrapper}`}
            >
              Couldn&apos;t load this preview. Refresh the page to try again.
            </div>
          ) : status !== 'ready' ? (
            <div
              aria-busy="true"
              aria-label={`Loading ${componentTitle}`}
              className={`animate-pulse rounded-xl bg-slate-100 ${componentWrapper}`}
            />
          ) : (
            <>
              <PreviewIframe
                showPreview={showPreview}
                componentHtml={sources.html}
                componentTitle={componentTitle}
                previewWidth={previewWidth}
                previewHeight={componentWrapper}
                refIframe={refIframe}
                previewDark={componentHasDark && isDarkMode}
              />

              <PreviewCode showPreview={showPreview} codeType={codeType} componentCode={previewCode} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}