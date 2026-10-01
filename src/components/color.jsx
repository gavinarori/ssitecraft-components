"use client"

import { Check, Clipboard } from "lucide-react"
import { toast } from "sonner"
import { trackEvent } from "../utils/events"
import { useColors } from "../hooks/use-colors"
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard"

export function Color({ color }) {
  const { format } = useColors()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const value = color[format]

  function handleCopy() {
    copyToClipboard(value)
    trackEvent({
      name: "copy_color",
      properties: { color: color.id, value, format },
    })
    toast.success(`Copied ${value} to clipboard.`)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${color.className} as ${format}`}
      className="group relative flex aspect-[3/1] w-full flex-1 flex-col gap-2 rounded-xl p-1 text-[--text] outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:aspect-[2/3] sm:h-auto sm:w-auto [&>svg]:absolute [&>svg]:right-3 [&>svg]:top-3 [&>svg]:z-10 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-0 [&>svg]:transition-opacity focus-visible:[&>svg]:opacity-100"
      style={{
        "--bg": `hsl(${color.hsl})`,
        "--text": color.foreground,
      }}
    >
      {isCopied ? (
        <Check className="group-hover:opacity-100" aria-hidden="true" />
      ) : (
        <Clipboard className="group-hover:opacity-100" aria-hidden="true" />
      )}

      {/* ring keeps near-white swatches visible on a white card */}
      <div className="w-full flex-1 rounded-lg bg-[--bg] ring-1 ring-inset ring-black/10 transition group-hover:scale-[1.03]" />

      <div className="flex w-full flex-col items-center justify-center gap-1 pb-1">
        <span className="hidden font-mono text-xs tabular-nums text-slate-600 transition-colors group-hover:text-slate-900 lg:flex">
          {color.className}
        </span>
        <span className="font-mono text-xs tabular-nums text-slate-500 transition-colors group-hover:text-slate-900 lg:hidden">
          {color.scale}
        </span>
      </div>
    </button>
  )
}