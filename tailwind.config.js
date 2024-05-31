/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFF7EF",
          100: "#FFF1E0",
          200: "#FFE8CC",
          'with-opacity': 'rgba(255, 247, 239, 1)',
        },
        secondary: {
          DEFAULT: "#D68C45",
          100: "#E4A368",
          200: "#F1B98C",
          'with-opacity': 'rgba(255, 247, 239, 0.5)',
        },
        olivorojo: {
          DEFAULT: "#B01716",
        },
        text: {
          DEFAULT: "#32211C"
        },
        dark: {
          DEFAULT: "#524439",
          100: "#726357",
          200: "#938275",
        },
        success: {
          DEFAULT: "#33B174",
          100: "#66C994",
          200: "#99E1B4",
        },
        warning: {
          DEFAULT: "#7B3100",
          100: "#995840",
          200: "#B78080",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  variants: {},
  plugins: [],
};
