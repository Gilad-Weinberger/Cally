/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-300":
          "var(--fallback-b3, oklch(var(--b3) / var(--tw-bg-opacity)))",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
