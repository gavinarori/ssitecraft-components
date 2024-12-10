"use client"

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

const gradientTypes = ['linear', 'radial', 'conic']
const tailwindColors = {
  'red': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'yellow': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'green': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'blue': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'indigo': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'purple': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  'pink': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
}

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState('linear')
  const [fromColor, setFromColor] = useState('blue-500')
  const [viaColor, setViaColor] = useState('none')
  const [toColor, setToColor] = useState('pink-500')
  const [direction, setDirection] = useState('to-r')
  const [customGradient, setCustomGradient] = useState('')
  const [gradientClass, setGradientClass] = useState('')

  useEffect(() => {
    updateGradientClass()
  }, [gradientType, fromColor, viaColor, toColor, direction, customGradient])

  const updateGradientClass = () => {
    if (customGradient) {
      setGradientClass(customGradient)
      return
    }

    let gradientClass = ''

    if (gradientType === 'linear') {
      gradientClass = `bg-gradient-${direction}`
    } else if (gradientType === 'radial') {
      gradientClass = 'bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]'
    } else if (gradientType === 'conic') {
      gradientClass = 'bg-[conic-gradient(var(--tw-gradient-stops))]'
    }

    gradientClass += ` from-${fromColor}`
    if (viaColor && viaColor !== 'none') gradientClass += ` via-${viaColor}`
    gradientClass += ` to-${toColor}`

    setGradientClass(gradientClass)
  }

  const ColorDropdown = ({ label, value, onChange, includeNone = false }) => (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value.split('-')[0]} onValueChange={(color) => onChange(`${color}-500`)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {includeNone && <SelectItem value="none">None</SelectItem>}
          {Object.entries(tailwindColors).map(([color, shades]) => (
            <SelectItem key={color} value={color}>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
                <span>{color}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value !== 'none' && (
        <Select value={value.split('-')[1]} onValueChange={(shade) => onChange(`${value.split('-')[0]}-${shade}`)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tailwindColors[value.split('-')[0]].map((shade) => (
              <SelectItem key={shade} value={shade}>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full bg-${value.split('-')[0]}-${shade}`} />
                  <span>{shade}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {gradientType === 'linear' && (
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
                <ColorDropdown label="From Color" value={fromColor} onChange={setFromColor} />
                <ColorDropdown label="Via Color" value={viaColor} onChange={setViaColor} includeNone={true} />
                <ColorDropdown label="To Color" value={toColor} onChange={setToColor} />
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

            <div className="space-y-4">
              <div className={`w-full h-64 rounded-lg ${gradientClass}`}></div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-mono text-sm break-all">{gradientClass}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

