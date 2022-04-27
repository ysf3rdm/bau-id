module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      boxShadow: {
        ball: '0 0 0 3px white, 0 0 0 4px #5284ff',
        dropdown: '-4px 18px 70px 0 rgba(108, 143, 167, 0.32)'
      }
    }
  },
  plugins: []
}
