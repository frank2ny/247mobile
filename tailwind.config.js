/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        'bg-light': '#F8F9FA',
        'brand-dark': '#0a0a0a',
        'text-main': '#171717',
        'text-muted': '#737373',
        primary: {
          500: '#f97316',
          600: '#ea580c',
        },
        surface: '#171717',
      }
    },
  },
  plugins: [],
}
