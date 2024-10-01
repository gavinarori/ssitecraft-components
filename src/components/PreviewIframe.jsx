import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";


export default function PreviewIframe({
  showPreview,
  componentHtml,
  componentTitle,
  previewWidth = '100%',
  previewHeight = 'h-[400px] lg:h-[600px]',
  refIframe,
  previewDark,

}) {
  const iframeTheme = previewDark ? 'bg-gray-950' : 'bg-white';

  return (
    <div
      {...(!showPreview && {
        hidden: true,
      })}
      className="rounded-md bg-white bg-[linear-gradient(45deg,_rgb(249_250_251)_25%,_transparent_25%),_linear-gradient(-45deg,_rgb(249_250_251)_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_rgb(249_250_251)_75%),_linear-gradient(-45deg,_transparent_75%,_rgb(249_250_251)_75%)] bg-[length:_20px_20px] [background-position:_0_0,_0_10px,_10px_-10px,_-10px_0px]"
    >
      <ResizablePanelGroup direction="horizontal" className="relative z-10">
        <ResizablePanel
          className={`relative rounded-lg border bg-white ${iframeTheme}`}
          defaultSize={100} 
        >
          
          <iframe
        className={`w-full rounded-md ring-2 ring-gray-100 lg:transition-all ${iframeTheme} ${previewHeight}`}
        loading="lazy"
        srcDoc={componentHtml}
        style={{ maxWidth: previewWidth }}
        title={`${componentTitle} Component`}
        ref={refIframe}
      ></iframe>

        </ResizablePanel>
        <ResizableHandle
          className={`relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block `}
        />
        <ResizablePanel defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  );
}
