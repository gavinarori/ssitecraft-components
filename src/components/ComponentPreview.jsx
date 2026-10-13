'use client'

import { useEffect, useRef, useState } from 'react'

import { useInView } from 'react-intersection-observer'

import { componentPreviewHtml, componentPreviewJsx, componentPreviewVue } from '@util/transformers'
import { componentBreakpoints } from '@data/breakpoints'

import PreviewCreator from '@component/PreviewCreator'
import PreviewBreakpoint from '@component/PreviewBreakpoint'
import PreviewCode from '@component/PreviewCode'
import PreviewCopy from '@component/PreviewCopy'
import PreviewIframe from '@component/PreviewIframe'
import PreviewInteractive from '@component/PreviewInteractive'
import PreviewTitle from '@component/PreviewTitle'
import LockedCode from '@component/LockedCode'
import PreviewView from '@component/PreviewView'
import PreviewType from '@component/PreviewType'

export default function ComponentPreview({ componentData, componentContainer }) {
  const refIframe = useRef(null)

  const [codeType, setCodeType] = useState('html')
  const [componentCode, setComponentCode] = useState('')
  const [componentHtml, setComponentHtml] = useState('')
  const [componentJsx, setComponentJsx] = useState('')
  const [componentVue, setComponentVue] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [previewCode, setPreviewCode] = useState('')
  const [previewWidth, setPreviewWidth] = useState('100%')
  const [showPreview, setShowPreview] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Pro components always preview. 'locked' only hides the CODE until this browser has bought the pack.
  const [codeLocked, setCodeLocked] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  })

  const {
    id: componentId,
    title: componentTitle,
    slug: componentSlug,
    category: componentCategory,
    container: componentSpace,
    creator: componentCreator,
    dark: componentHasDark,
    interactive: componentHasInteractive,
  } = componentData

  const trueComponentContainer = componentSpace || componentContainer?.previewInner
  const componentWrapper = componentContainer?.previewHeight || 'h-[400px] lg:h-[600px]'

  const componentHash = `component-${componentId}`

  useEffect(() => {
    if (inView) {
      fetchHtml({
        useDark: isDarkMode,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    if (inView) {
      fetchHtml({
        useDark: isDarkMode,
        useInteractive: isInteractive,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, isInteractive])

  useEffect(() => {
    if (inView) {
      const transformedHtml = componentPreviewHtml(
        componentCode,
        trueComponentContainer,
        isDarkMode,
      )

      setComponentHtml(transformedHtml)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    codeType === 'html' && setPreviewCode(componentCode)
    codeType === 'jsx' && setPreviewCode(componentJsx)
    codeType === 'vue' && setPreviewCode(componentVue)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeType])

  async function fetchHtml(useOptions = {}) {
    const { useDark, useInteractive } = useOptions

    const useDarkMode = componentHasDark && useDark
    const useInteractiveMode = componentHasInteractive && useInteractive

    const componentPath = [componentId, useDarkMode && 'dark', useInteractiveMode && 'interactive']
      .filter(Boolean)
      .join('-')

    let textResponse = null
    let tried = ''
    let codeLockedNow = false

    if (componentData.pro) {
      // preview=1: the server always returns the HTML for the live preview, and says in a header
      // whether this browser may also see and copy the code (buyers and free samples).
      tried = `/api/code/${componentData.packId}/${componentPath}.html?preview=1`
      const fetchResponse = await fetch(tried).catch(() => null)
      if (fetchResponse?.ok) {
        codeLockedNow = fetchResponse.headers.get('x-code-access') !== 'granted'
        setCodeLocked(codeLockedNow)
        textResponse = await fetchResponse.text()
      }
    } else {
      // Try the slug as written, then lower-case (Vercel's file system is case-sensitive)
      const folders = [...new Set([`${componentCategory}-${componentSlug}`, `${componentCategory}-${componentSlug}`.toLowerCase()])]
      for (const folder of folders) {
        tried = `/components/${folder}/${componentPath}.html`
        try {
          const fetchResponse = await fetch(tried)
          if (fetchResponse.ok) {
            const text = await fetchResponse.text()
            // A missing file can come back as an HTML 404 page with status 200 on some hosts
            if (text && !/<title>\s*404/i.test(text)) {
              textResponse = text
              break
            }
          }
        } catch {}
      }
    }

    if (textResponse === null) {
      setLoadError(`Could not load ${tried}. Check that this file exists under public${tried}.`)
      return
    }
    setLoadError('')
    const transformedHtml = componentPreviewHtml(
      textResponse,
      trueComponentContainer,
      useDark,
    )
    const transformedJsx = componentPreviewJsx(textResponse)
    const transformedVue = componentPreviewVue(textResponse)

    // Locked: keep the markup out of the code view, the copy button and the JSX/Vue converters
    const keepCode = !(componentData.pro && codeLockedNow)
    setPreviewCode(keepCode ? textResponse : '')
    setComponentCode(keepCode ? textResponse : '')
    setComponentHtml(transformedHtml)
    setComponentJsx(keepCode ? transformedJsx : '')
    setComponentVue(keepCode ? transformedVue : '')
  }

  return (
    <div ref={ref} id={componentHash}>
      <div className="space-y-4">
        <div className="lg:flex lg:items-center">
          {componentHtml && (
            <div className="flex flex-wrap items-center  gap-2 sm:gap-4">
              <PreviewView handleSetShowPreview={setShowPreview}  />

              {!codeLocked && <PreviewType componentId={componentId} handleSetCodeType={setCodeType} />}

              {codeLocked ? (
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden="true"><path fillRule="evenodd" d="M10 1a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V5a4 4 0 0 0-4-4Zm2 6V5a2 2 0 1 0-4 0v2h4Z" clipRule="evenodd" /></svg>
                  Pro code
                </button>
              ) : (
                <PreviewCopy componentCode={previewCode} codeType={codeType} />
              )}

              {componentHasInteractive && (
                <PreviewInteractive
                  isInteractive={isInteractive}
                  handleSetIsInteractive={setIsInteractive}
                />
              )}

            </div>
          )}

          <div className="hidden lg:flex lg:flex-1 lg:items-end lg:justify-end lg:gap-4">
                <PreviewBreakpoint
                  handleSetPreviewWidth={setPreviewWidth}
                />

          </div>
        </div>

        {loadError && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>{componentTitle}</strong>: {loadError}
          </p>
        )}

        <div className="relative">
          <div>
            <PreviewIframe
              showPreview={showPreview}
              componentHtml={componentHtml}
              componentTitle={componentTitle}
              previewWidth={previewWidth}
              previewHeight={componentWrapper}
              refIframe={refIframe}
              previewDark={componentHasDark && isDarkMode}
            />

            {codeLocked ? (
              <LockedCode hidden={showPreview} pack={componentData.pack} single={componentData.single} />
            ) : (
            <PreviewCode
              componentId={componentId}
              showPreview={showPreview}
              codeType={codeType}
              showToggle={!isInteractive}
              componentCode={previewCode}
            />
            )}
          </div>
        </div>

       
      </div>
    </div>
  )
}