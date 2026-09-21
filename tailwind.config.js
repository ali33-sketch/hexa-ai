/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#111827",
        indigo: "#4F46E5",
        cyan: "#06B6D4"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-sora)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
