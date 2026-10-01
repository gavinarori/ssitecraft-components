"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { toast } from "sonner";
import twColors from "tailwindcss/colors";
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

const GRADIENT_TYPES = ["linear", "radial", "conic"];

const DIRECTIONS = [
  { value: "to-r", label: "To Right", css: "to right" },
  { value: "to-l", label: "To Left", css: "to left" },
  { value: "to-t", label: "To Top", css: "to top" },
  { value: "to-b", label: "To Bottom", css: "to bottom" },
  { value: "to-tr", label: "To Top Right", css: "to top right" },
  { value: "to-tl", label: "To Top Left", css: "to top left" },
  { value: "to-br", label: "To Bottom Right", css: "to bottom right" },
  { value: "to-bl", label: "To Bottom Left", css: "to bottom left" },
];

const tailwindColors = themeColors.reduce((acc, color) => {
  acc[color] = themeColorsWithoutShades.includes(color) ? [] : themeColorShades;
  return acc;
}, {});

/** "blue-500" -> "#3b82f6", "white" -> "#fff", unknown -> null */
function resolveColor(token) {
  if (!token || token === "none") return null;
  const [name, shade] = token.split("-");
  try {
    const entry = twColors[name];
    if (typeof entry === "string") return entry;
    return entry?.[shade] ?? null;
  } catch {
    return null;
  }
}

/**
 * Why this exists: classes built at runtime like `from-${color}` are never seen by
 * Tailwind's scanner, so in a production build the preview showed no colors.
 * The preview now paints with real color values; the copied output is still the
 * Tailwind class string.
 */
function buildPreviewImage({ gradientType, direction, from, via, to }) {
  const stops = [resolveColor(from), resolveColor(via), resolveColor(to)].filter(Boolean);
  if (stops.length < 2 || (via !== "none" && !resolveColor(via))) return null;

  if (gradientType === "radial") return `radial-gradient(circle at center, ${stops.join(", ")})`;
  if (gradientType === "conic") return `conic-gradient(from 0deg, ${stops.join(", ")})`;

  const css = DIRECTIONS.find((d) => d.value === direction)?.css ?? "to right";
  return `linear-gradient(${css}, ${stops.join(", ")})`;
}

function buildGradientClass({ gradientType, direction, from, via, to, custom }) {
  if (custom) return custom;

  const base =
    gradientType === "radial"
      ? "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))]"
      : gradientType === "conic"
        ? "bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))]"
        : `bg-gradient-${direction}`;

  return [base, `from-${from}`, via && via !== "none" ? `via-${via}` : "", `to-${to}`]
    .filter(Boolean)
    .join(" ");
}

// Defined at module level. Declared inside GradientGenerator before, it was re-created
// on every render, which remounted the selects and closed them while the user was choosing.
function ColorDropdown({ label, value, onChange, includeNone = false }) {
  const id = `color-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const [name, shade] = value.split("-");
  const shades = tailwindColors[name] ?? [];

  function handleColorChange(nextName) {
    if (nextName === "none") return onChange("none");
    // black / white / transparent have no shades, so don't append "-500" to them
    onChange(tailwindColors[nextName]?.length ? `${nextName}-500` : nextName);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Select value={name} onValueChange={handleColorChange}>
        <SelectTrigger id={id} className="w-full sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {includeNone && <SelectItem value="none">None</SelectItem>}
          {Object.entries(tailwindColors).map(([color, colorShades]) => (
            <SelectItem key={color} value={color}>
              <div className="flex items-center gap-2">
                <span
                  className="size-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: resolveColor(colorShades.length ? `${color}-500` : color) ?? "transparent" }}
                />
                <span>{color}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value !== "none" && shades.length > 0 && (
        <Select
          value={shade ?? "500"}
          onValueChange={(nextShade) => onChange(`${name}-${nextShade}`)}
        >
          <SelectTrigger aria-label={`${label} shade`} className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {shades.map((s) => (
              <SelectItem key={s} value={s}>
                <div className="flex items-center gap-2">
                  <span
                    className="size-4 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: resolveColor(`${name}-${s}`) ?? "transparent" }}
                  />
                  <span>{s}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState("linear");
  const [fromColor, setFromColor] = useState("blue-500");
  const [viaColor, setViaColor] = useState("none");
  const [toColor, setToColor] = useState("pink-500");
  const [direction, setDirection] = useState("to-r");
  const [customGradient, setCustomGradient] = useState("");
  const [isDark, setIsDark] = useState(false);
  const textInputRef = useRef(null);

  const { isCopied, copyToClipboard } = useCopyToClipboard();

  // Derived values: no effect + extra render needed to keep them in sync
  const gradientClass = useMemo(
    () =>
      buildGradientClass({
        gradientType,
        direction,
        from: fromColor,
        via: viaColor,
        to: toColor,
        custom: customGradient.trim(),
      }),
    [gradientType, direction, fromColor, viaColor, toColor, customGradient]
  );

  const previewImage = useMemo(
    () =>
      customGradient.trim()
        ? null // custom classes can only be previewed through the class itself
        : buildPreviewImage({ gradientType, direction, from: fromColor, via: viaColor, to: toColor }),
    [gradientType, direction, fromColor, viaColor, toColor, customGradient]
  );

  // Use the computed image when we have one, otherwise fall back to the class string
  const previewStyle = previewImage ? { backgroundImage: previewImage } : undefined;
  const previewClass = previewImage ? "" : gradientClass;

  function handleCopy() {
    copyToClipboard(gradientClass);
    toast.success(`Copied "${gradientClass}" to clipboard.`);
  }

  const CopyIcon = isCopied ? Check : Clipboard;

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="space-y-2">
                <Label htmlFor="gradient-type">Gradient Type</Label>
                <Select value={gradientType} onValueChange={setGradientType}>
                  <SelectTrigger id="gradient-type" className="w-full sm:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {gradientType === "linear" && (
                <div className="space-y-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger id="direction" className="w-full sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIRECTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <ColorDropdown label="From Color" value={fromColor} onChange={setFromColor} />
              <ColorDropdown label="Via Color" value={viaColor} onChange={setViaColor} includeNone />
              <ColorDropdown label="To Color" value={toColor} onChange={setToColor} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-gradient">Custom Gradient</Label>
              <Input
                id="custom-gradient"
                placeholder="e.g., bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-500 to-blue-500"
                value={customGradient}
                onChange={(e) => setCustomGradient(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Leave empty to use the pickers. Custom classes only preview if they exist in your
                Tailwind build.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy gradient classes"
              style={previewStyle}
              className={`group relative h-56 w-full rounded-xl ring-1 ring-black/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:h-64 ${previewClass}`}
            >
              <CopyIcon
                aria-hidden="true"
                className={`absolute right-4 top-4 h-6 w-6 drop-shadow transition-opacity ${
                  isCopied ? "text-white opacity-100" : "text-white opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>

            <div
              className={`relative flex h-56 w-full items-center rounded-xl p-8 sm:h-64 ${
                isDark ? "bg-white ring-1 ring-slate-200" : "bg-black"
              }`}
            >
              <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-2 p-3">
                <button
                  type="button"
                  className="rounded-lg bg-slate-800 p-2.5 text-white transition hover:bg-slate-700"
                  onClick={() => textInputRef.current?.focus()}
                >
                  <span className="sr-only">Edit text</span>
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-800 p-2.5 text-white transition hover:bg-slate-700"
                  onClick={() => setIsDark((prev) => !prev)}
                >
                  <span className="sr-only">Toggle {isDark ? "dark" : "light"} background</span>
                  <BulbIcon className="h-4 w-4" />
                </button>
              </div>

              <p
                ref={textInputRef}
                style={previewStyle}
                className={`min-w-full rounded bg-clip-text p-2 text-center text-2xl font-bold text-transparent outline-none focus:ring-2 focus:ring-indigo-400/60 ${previewClass}`}
                spellCheck="false"
                contentEditable
                suppressContentEditableWarning
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec erat in turpis
                tincidunt mollis.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-300 hover:bg-white"
            >
              <code className="break-all font-mono text-sm text-slate-800">{gradientClass}</code>
              <CopyIcon
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 ${
                  isCopied ? "text-emerald-600" : "text-slate-400 group-hover:text-indigo-600"
                }`}
              />
              <span className="sr-only">Copy classes</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}