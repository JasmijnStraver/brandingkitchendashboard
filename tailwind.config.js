/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          DEFAULT: "#5C1A24",
          dark: "#3E1017",
          light: "#7A2531",
        },
        crave: {
          red: "#C21E2C",
          cream: "#F7F0EC",
          ink: "#1F1315",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
