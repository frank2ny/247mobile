/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // Web only: Tailwind's reset strips the background from <button>, which react-native-web
  // renders for every Pressable with role "button". react-native-web has its own reset.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        background: '#F2F0EC',
        'bg-light': '#F2F0EC',
        card: '#FAF9F6',
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
