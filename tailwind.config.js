module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      '900px': '900px',
      lg: '1024px',
      '1200px': '1200px',
      xl: '1280px',
      '1400px': '1400px',
      '2xl': '1536px'
    },
    extend: {
      boxShadow: {
        ball: '0 0 0 3px white, 0 0 0 4px #5284ff',
        dropdown: '-4px 18px 70px 0 rgba(108, 143, 167, 0.32)',
        popup: '0px 3px 9px rgba(0, 0, 0, 0.12)'
      },
      fontFamily: {
        urbanist: ['Urbanist'],
        cocoSharp: ['CocoSharp']
      },
      gridTemplateColumns: {
        profile: '360px 1fr'
      }
    }
  },
  plugins: []
}
