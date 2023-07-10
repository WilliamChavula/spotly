/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      minHeight: {
        6: "1.5rem",
        12: "3rem",
      },
      minWidth: {
        6: "1.5rem",
        12: "3rem",
      },
    },
  },
  plugins: [],
};
