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

    const componentUrl = `/components/${componentCategory}-${componentSlug}/${componentPath}.html`

    const fetchResponse = await fetch(componentUrl)
    const textResponse = await fetchResponse.text()
    const transformedHtml = componentPreviewHtml(
      textResponse,
      trueComponentContainer,
      useDark,
    )
    const transformedJsx = componentPreviewJsx(textResponse)
    const transformedVue = componentPreviewVue(textResponse)

    setPreviewCode(textResponse)
    setComponentCode(textResponse)
    setComponentHtml(transformedHtml)
    setComponentJsx(transformedJsx)
    setComponentVue(transformedVue)
  }

  return (
    <div ref={ref} id={componentHash}>
      <div className="space-y-4">
        <PreviewTitle componentTitle={componentTitle} componentHash={componentHash} />

        <div className="lg:flex lg:items-center">
          {componentCode && (
            <div className="flex flex-wrap items-center  gap-2 sm:gap-4">
              <PreviewView handleSetShowPreview={setShowPreview}  />

              <PreviewType componentId={componentId} handleSetCodeType={setCodeType} />

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
                <PreviewBreakpoint
                  handleSetPreviewWidth={setPreviewWidth}
                />

          </div>
        </div>

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

            <PreviewCode
              componentId={componentId}
              showPreview={showPreview}
              codeType={codeType}
              showToggle={!isInteractive}
              componentCode={previewCode}
            />
          </div>
        </div>

       
      </div>
    </div>
  )
}
