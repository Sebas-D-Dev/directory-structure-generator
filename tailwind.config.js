// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Make sure it scans the app directory
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Also scan the components directory
    './layouts/**/*.{js,ts,jsx,tsx,mdx}', // And layouts
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
