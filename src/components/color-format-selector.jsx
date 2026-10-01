"use client"

import * as React from "react"

import { getColorFormat } from "../utils/colors"
import { cn } from "../utils/cn"
import { useColors } from "../hooks/use-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select"
import { Skeleton } from "../components/ui/skeleton"

export function ColorFormatSelector({ color, className, ...props }) {
  const { format, setFormat, isLoading } = useColors()
  const formats = React.useMemo(() => getColorFormat(color), [color])

  if (isLoading) {
    return <ColorFormatSelectorSkeleton />
  }

  return (
    <Select value={format} onValueChange={setFormat}>
      <SelectTrigger
        aria-label="Color format"
        className={cn(
          "h-8 w-auto gap-1.5 rounded-lg border-slate-200 bg-white pr-2 text-xs shadow-sm",
          className
        )}
        {...props}
      >
        <span className="font-medium text-slate-700">Format:</span>
        <span className="font-mono text-xs text-slate-500">{format}</span>
      </SelectTrigger>

      <SelectContent align="end" className="rounded-xl">
        {/* renamed the loop variable: it used to shadow `format` from the hook */}
        {Object.entries(formats).map(([formatName, formatValue]) => (
          <SelectItem
            key={formatName}
            value={formatName}
            className="gap-2 rounded-lg [&>span]:flex [&>span]:items-center [&>span]:gap-2"
          >
            <span className="font-medium">{formatName}</span>
            <span className="font-mono text-xs text-slate-500">{formatValue}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ColorFormatSelectorSkeleton({ className, ...props }) {
  return <Skeleton className={cn("h-8 w-[116px] rounded-lg", className)} {...props} />
}