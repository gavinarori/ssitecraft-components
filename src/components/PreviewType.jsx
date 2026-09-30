import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

import { cn } from '../utils/cn'

const CODE_TYPES = [
  { value: 'html', label: 'HTML' },
  { value: 'jsx', label: 'JSX' },
  { value: 'vue', label: 'Vue' },
]

// Pass `codeType` to control the select from the parent; omit it and it starts on HTML.
// (Before, it showed a placeholder even though the code below was already HTML.)
export default function PreviewType({ componentId, codeType, handleSetCodeType }) {
  const valueProps = codeType ? { value: codeType } : { defaultValue: 'html' }

  return (
    <div>
      <label htmlFor={`CodeType${componentId}`} className="sr-only">
        Code type
      </label>

      <Select onValueChange={handleSetCodeType} {...valueProps}>
        <SelectTrigger
          id={`CodeType${componentId}`}
          className={cn(
            'h-7 w-[110px] rounded-lg border-slate-200 bg-white text-xs shadow-sm [&_svg]:h-4 [&_svg]:w-4'
          )}
        >
          <SelectValue placeholder="Code type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs text-slate-500">Code type</SelectLabel>
            {CODE_TYPES.map(({ value, label }) => (
              <SelectItem key={value} className="text-xs" value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}