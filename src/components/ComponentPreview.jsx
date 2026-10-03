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

  const previewCode = codeType === 'jsx' ? sources.jsx : codeType === 'vue' ? sources.vue : sources.raw

  return (
    <div ref={ref} id={componentHash} className="scroll-mt-32">
      {/* One window: title bar carries the name and every control, body is the preview or the code */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(10_10_10/0.04)] ring-1 ring-neutral-950/10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-neutral-950/10 bg-neutral-50 px-3 py-2">
          <h3 className="mr-auto min-w-0 truncate text-sm font-medium text-neutral-950">
            <a href={`#${componentHash}`} className="sc-focus rounded-sm hover:underline hover:underline-offset-4">
              {componentTitle}
            </a>
          </h3>

          {status === 'ready' && (
            <>
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
            </>
          )}

          <div className="hidden lg:block">
            <PreviewBreakpoint handleSetPreviewWidth={setPreviewWidth} />
          </div>
        </div>

        <div className="relative">
          {status === 'error' ? (
            <div
              role="alert"
              className={`sc-hatch grid place-items-center p-6 ${componentWrapper}`}
            >
              <p className="max-w-sm rounded-lg bg-white px-4 py-3 text-center text-sm text-neutral-700 ring-1 ring-neutral-950/10">
                This preview didn&apos;t load. Refresh the page to try again.
              </p>
            </div>
          ) : status !== 'ready' ? (
            <div
              aria-busy="true"
              aria-label={`Loading ${componentTitle}`}
              className={`sc-hatch animate-pulse ${componentWrapper}`}
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