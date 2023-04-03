/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        body: "#191c24",
        primary: "#45A29E",
        accent: "#4E6090",
        primaryLight: "#59b8b4",
        bgPrimary: "#1E2124",
        bgSecondary: "#25272a",
        bgSecondary2: "#2b2e31",
        textDescription: "rgba(255, 255, 255, 0.6)",
        textDescriptionSecondary: "#828282",
        lightgray: "#bdbdbd",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        md2: "900px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        lg2: "1140px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
