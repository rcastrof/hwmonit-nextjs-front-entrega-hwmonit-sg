module.exports = {
  content: [
	"./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens:{
      'm' : '768px',
      'md': '1366px', 
      'lg': '1440px',
      'xl': '1920px'
    },
    extend: {
      fontFamily: {
        body: ['Open Sans', 'sans-serif'],
      },
      colors:{
        'hw-blue': '#004466',
        'hw-white': '#FAFAFA',
        'hw-sky': '#0089CD',
        'hw-orange': '#F25B3D',
        'hw-orange-hover': '#D64E34',
        'hw-gray-bg': '#F5F5F5',
        'hw-black': '#333333',
        'hw-alert': "#E00000",
        "hw-warning": "#FF9900",
        "hw-ok": "#9EC431",
        'hw-button': '#EA683F'


	  },
      backgroundImage: {
        'hw-background': "url('../public/background-hwmonit.png')"
      }
    },
  },
  plugins: [],
}
