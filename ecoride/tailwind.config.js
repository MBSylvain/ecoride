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
        customGreen: {
          100: "#2a5d53",
          80: "#2a5d53",
          60: "#2a5d53",
          40: "#2a5d53",
          20: "#2a5d53",
        },
        customGreen2: {
          100: "#58c3af",
          80: "#58c3af",
          60: "#58c3af",
          40: "#58c3af",
          20: "#58c3af",
        },
        customGrey: {
          100: "f5f5f5",
          80: "#f5f5f5",
          60: "#f5f5f5",
          40: "#f5f5f5",
          20: "#f5f5f5",
        },
        customPink: {
          100: "ffb1aa",
          80: "#ffb1aa",
          60: "#ffb1aa",
          40: "#ffb1aa",
          20: "#ffb1aa",
        },
      },
    },
  },
  plugins: [],
};
