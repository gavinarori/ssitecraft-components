import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { componentBreakpoints } from '../data/breakpoints'

export default function PreviewBreakpoint({ handleSetPreviewWidth }) {
  return (
    <div
      className="hidden items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm md:flex"
      role="group"
      aria-label="Preview width"
    >
      <ToggleGroup
        type="single"
        className="gap-0.5"
        onValueChange={(value) => handleSetPreviewWidth(value)}
      >
        {componentBreakpoints.map((breakpoint) => (
          <ToggleGroupItem
            key={breakpoint.name}
            value={breakpoint.width}
            aria-label={`${breakpoint.name} width`}
            title={breakpoint.name}
            className="grid h-7 w-7 place-items-center rounded-md p-0 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-700"
          >
            {breakpoint.icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}