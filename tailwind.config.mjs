const defaultTheme = require('tailwindcss/defaultTheme')

const svgToDataUri = require("mini-svg-data-uri");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: ["class"],
  content: ['./app/**/*.jsx', './src/components/**/*.jsx', './src/data/components/*.mdx'],
  safelist: [
    { pattern: /bg-gradient-to-(t|b|l|r|tl|tr|bl|br)/ },
    { pattern: /from-(.+)-([1-9]00)/ },
    { pattern: /via-(.+)-([1-9]00)/ },
    { pattern: /to-(.+)-([1-9]00)/ },
    { pattern: /(from|via|to)-(black|white|transparent)/ },
  ],  
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.mono],
      },
      gradientColorStops: {
        ...require('tailwindcss/colors'),
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'),
    
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
}

export default tailwindConfig
