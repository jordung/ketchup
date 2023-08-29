/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#E23A2B",
          secondary: "#003977",
          accent: "#fee2e2",
          neutral: "#353535",
          "base-100": "#F6F6F6",
          info: "#348CED",
          success: "#31C48D",
          warning: "#ffc800",
          error: "#E5574D",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
