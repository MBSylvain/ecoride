/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#003051",
          80: "#003051",
          60: "#003051",
          40: "#003051",
          20: "#003051",
        },
        customGreen: "#2a5d53",
        customGreen2: "#58c3af",
        customGrey: "#f5f5f5",
        customPink: "#ffb1aa",
      },
    },
  },
  plugins: [],
};
