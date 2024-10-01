import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { cn } from "../utils/cn";

export default function PreviewType({ componentId, handleSetCodeType }) {
  return (
    <div className="border-r border-gray-50">
      <label htmlFor={`CodeType${componentId}`} className="sr-only">
        Code Type
      </label>

      <Select onValueChange={handleSetCodeType}>
        <SelectTrigger id={`CodeType${componentId}`}  className={cn(
          "h-7 w-[145px] text-xs [&_svg]:h-4 [&_svg]:w-4"
        )}>
          <SelectValue placeholder="Select Code Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup >
            <SelectLabel className="text-xs">Code Type</SelectLabel>
            <SelectItem className="text-xs" value="html">HTML</SelectItem>
            <SelectItem className="text-xs" value="jsx">JSX</SelectItem>
            <SelectItem className="text-xs" value="vue">Vue</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
