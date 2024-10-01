import {
  ToggleGroup,
  ToggleGroupItem,
} from "./ui/toggle-group";
import { componentBreakpoints } from "../data/breakpoints"; 

export default function PreviewBreakpoint({
  handleSetPreviewWidth,
}) {
  return (
    <div className="hidden h-[28px] items-center gap-1.5 rounded-md border p-[2px] shadow-sm md:flex">
      <ToggleGroup
        type="single"
        onValueChange={(value) => {
          handleSetPreviewWidth(value); 
        }}
      >
        {componentBreakpoints.map((breakpoint) => (
          <ToggleGroupItem
            key={breakpoint.name}
            value={breakpoint.width} 
            className="h-[22px] w-[22px] rounded-lg p-0"
          >
            {breakpoint.icon} 
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
