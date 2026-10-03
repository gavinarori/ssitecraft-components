import { getColors } from '@util/colors'
import { ColorPalette } from '@component/color-palette'

export default function ColorsPage() {
  const colors = getColors()

  return (
    <div className="grid gap-10">
      {colors.map((colorPalette) => (
        <ColorPalette key={colorPalette.name} colorPalette={colorPalette} />
      ))}
    </div>
  )
}
