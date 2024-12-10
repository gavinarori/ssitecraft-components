"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Clipboard } from "lucide-react";
import { toast } from "sonner";
import PencilIcon from "../icons/IconPencil";
import BulbIcon from "../icons/IconBulb";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import {
  themeColors,
  themeColorShades,
  themeColorsWithoutShades,
} from "../data/assests/tailwindColors";

const gradientTypes = ["linear", "radial", "conic"];

const tailwindColors = themeColors.reduce((acc, color) => {
  if (themeColorsWithoutShades.includes(color)) {
    acc[color] = []; // No shades for 'black', 'white', and 'transparent'
  } else {
    acc[color] = themeColorShades;
  }
  return acc;
}, {});

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState("linear");
  const [fromColor, setFromColor] = useState("blue-500");
  const [viaColor, setViaColor] = useState("none");
  const [toColor, setToColor] = useState("pink-500");
  const [direction, setDirection] = useState("to-r");
  const [customGradient, setCustomGradient] = useState("");
  const [gradientClass, setGradientClass] = useState("");
  const [isDark, setIsDark] = useState(false);
  const textInputRef = useRef(null);

  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const backgroundColor = isDark ? "bg-white" : "bg-black";

  const handleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleEdit = () => {
    textInputRef.current.focus();
  };

  useEffect(() => {
    updateGradientClass();
  }, [gradientType, fromColor, viaColor, toColor, direction, customGradient]);

  const updateGradientClass = () => {
    let gradientClass = "";

    if (customGradient) {
      setGradientClass(customGradient);
      return;
    }

    switch (gradientType) {
      case "linear":
        gradientClass = `bg-gradient-${direction}`;
        break;
      case "radial":
        gradientClass =
          "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))]";
        break;
      case "conic":
        gradientClass =
          "bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))]";
        break;
      default:
        gradientClass = "";
    }

    // Add colors
    gradientClass += ` from-${fromColor}`;
    if (viaColor && viaColor !== "none") {
      gradientClass += ` via-${viaColor}`;
    }
    gradientClass += ` to-${toColor}`;

    setGradientClass(gradientClass);
  };


  const ColorDropdown = ({ label, value, onChange, includeNone = false }) => (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select
        value={value.split("-")[0]}
        onValueChange={(color) => onChange(`${color}-500`)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {includeNone && <SelectItem value="none">None</SelectItem>}
          {Object.entries(tailwindColors).map(([color, shades]) => (
            <SelectItem key={color} value={color}>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    shades.length ? `bg-${color}-500` : `bg-${color}`
                  }`}
                />
                <span>{color}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value !== "none" && tailwindColors[value.split("-")[0]].length > 0 && (
        <Select
          value={value.split("-")[1]}
          onValueChange={(shade) =>
            onChange(`${value.split("-")[0]}-${shade}`)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tailwindColors[value.split("-")[0]].map((shade) => (
              <SelectItem key={shade} value={shade}>
                <div
                  className={`w-4 h-4 rounded-full bg-${value.split("-")[0]}-${shade}`}
                />
                <span>{shade}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div>
                  <Label htmlFor="gradient-type">Gradient Type</Label>
                  <Select value={gradientType} onValueChange={setGradientType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {gradientType === "linear" && (
                  <div>
                    <Label htmlFor="direction">Direction</Label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-r">To Right</SelectItem>
                        <SelectItem value="to-l">To Left</SelectItem>
                        <SelectItem value="to-t">To Top</SelectItem>
                        <SelectItem value="to-b">To Bottom</SelectItem>
                        <SelectItem value="to-tr">To Top Right</SelectItem>
                        <SelectItem value="to-tl">To Top Left</SelectItem>
                        <SelectItem value="to-br">To Bottom Right</SelectItem>
                        <SelectItem value="to-bl">To Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <ColorDropdown
                  label="From Color"
                  value={fromColor}
                  onChange={setFromColor}
                />
                <ColorDropdown
                  label="Via Color"
                  value={viaColor}
                  onChange={setViaColor}
                  includeNone={true}
                />
                <ColorDropdown
                  label="To Color"
                  value={toColor}
                  onChange={setToColor}
                />
              </div>

              <div>
                <Label htmlFor="custom-gradient">Custom Gradient</Label>
                <Input
                  id="custom-gradient"
                  placeholder="e.g., bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]"
                  value={customGradient}
                  onChange={(e) => setCustomGradient(e.target.value)}
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  copyToClipboard(gradientClass);
                  toast.success(`Copied "${gradientClass}" to clipboard.`);
                }}
                className={`w-full h-64 rounded-lg relative group ${gradientClass}`}
              >
                {isCopied ? (
                  <Check className="absolute right-4 top-4 h-6 w-6 text-green-500 opacity-100 transition-opacity" />
                ) : (
                  <Clipboard className="absolute right-4 top-4 h-6 w-6 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </button>
              <div
                className={`relative w-full h-64  flex items-center rounded-xl p-8 ${backgroundColor}`}
              >
                <div className="absolute inset-x-0 top-0 flex items-center justify-end p-4">
                  <button
                    className="rounded-xl bg-gray-800 p-2.5 text-white"
                    onClick={handleEdit}
                  >
                    <span className="sr-only">Edit text</span>
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="ml-2 rounded-xl bg-gray-800 p-2.5 text-white"
                    onClick={handleDark}
                  >
                    <span className="sr-only">
                      Toggle {isDark ? "light" : "dark"} theme
                    </span>
                    <BulbIcon className="h-4 w-4" />
                  </button>
                </div>
                <p
                  ref={textInputRef}
                  className={`min-w-full rounded bg-clip-text p-2 text-center text-2xl font-bold text-transparent ${gradientClass}`}
                  spellCheck="false"
                  contentEditable="true"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  nec erat in turpis tincidunt mollis.
                </p>
              </div>
              <div
                className="bg-gray-100 p-4 rounded-lg flex items-center justify-between group cursor-pointer"
                onClick={() => {
                  copyToClipboard(gradientClass);
                  toast.success(`Copied "${gradientClass}" to clipboard.`);
                }}
              >
                <p className="font-mono text-sm break-all">{gradientClass}</p>
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Clipboard className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
