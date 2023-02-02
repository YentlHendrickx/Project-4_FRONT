// 
module.exports = {
  content: [
    "./src/App.js",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'uiPrimary'         : '#e63946ff',  // Imperial Red
        'uiSecondary'       : '#457B9D',    // Celadon Blue
        'uiSecondaryLight'  : '#679DBF',    // Celadon Blue lighter?
        'uiLight'           : '#f1faeeff',  // Honeydew
        'uiLight2'          : '#A8DADC',    // Powder Blue
        'uiNav'             : '#1D3557',    // Prussian Blue
        'edit'              : '#0A8754',    // Green
        'delete'            : '#c70000',    // Red
        'deleteHover'       : '#e90000',
        'create'            : '#3b83f6',
        'save'              : '#00ab66',
        'saveHover'         : '#00cd88',
      },
    },
  },
  plugins: [],
}
