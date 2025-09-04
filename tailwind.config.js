/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',    // Dark blue for hospital theme
        secondary: '#10B981',  // Green for success/accents
        accent: '#3B82F6',     // Light blue for buttons
      },
    },
  },
  plugins: [],
}

