import * as React from "react"
import { Color } from "./color"
import {
  ColorFormatSelector,
  ColorFormatSelectorSkeleton,
} from "./color-format-selector"

export function ColorPalette({ colorPalette }) {
  return (
    <section
      id={colorPalette.name}
      aria-labelledby={`palette-${colorPalette.name}`}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="flex items-center gap-3 px-1 pb-2 pt-1">
        <h2
          id={`palette-${colorPalette.name}`}
          className="flex-1 text-base font-semibold capitalize tracking-tight text-slate-900"
        >
          {colorPalette.name}
        </h2>

        <React.Suspense fallback={<ColorFormatSelectorSkeleton />}>
          <ColorFormatSelector color={colorPalette.colors[0]} className="ml-auto" />
        </React.Suspense>
      </div>

      <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
        {colorPalette.colors.map((color) => (
          <Color key={color.hex} color={color} />
        ))}
      </div>
    </section>
  )
}