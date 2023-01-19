/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.js",
    "./src/components/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    colors: {
      'uiPrimary'     : '#e63946ff', // Imperial Red
      'uiSecondary'   : '#457B9D',   // Celadon Blue
      'uiLight'       : '#f1faeeff', // Honeydew
      'uiLight2'      : '#A8DADC',   // Powder Blue
      'uiNav'         : '#1D3557',   // Prussian Blue

    },
    extend: {},
  },
  plugins: [],
}
