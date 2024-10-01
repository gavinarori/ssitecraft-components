import { Smartphone, Tablet, Laptop, Monitor } from "lucide-react";

export const componentBreakpoints = [
  {
    name: 'Mobile',
    icon: <Smartphone className="h-3.5 w-3.5" />, 
    width: '340px',
  },
  {
    name: 'Small',
    icon: <Tablet className="h-3.5 w-3.5" />, 
    width: '640px',
  },
  {
    name: 'Medium',
    icon: <Laptop className="h-3.5 w-3.5" />, 
  },
  {
    name: 'Large',
    icon: <Monitor className="h-3.5 w-3.5" />, 
    width: '1024px',
  },
  {
    name: 'Full',
    icon: <Monitor className="h-3.5 w-3.5" />, 
    width: '100%',
  },
];
