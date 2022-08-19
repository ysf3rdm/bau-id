module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    colors: {
      gray: {
        100: '#363740',
        200: '#62636D',
        300: '#93949F',
        400: '#C7C8D3',
        500: '#E3E3E9',
      },
      dark: {
        common: '#071A2F',
      },
      primary: '#134757',
      primaryBg: '#F8F8FC',
      primaryDark: '#0C0D17',
      green: '#25C196',
      error: '#EE5D5D',
      alert: '#F9AF60',
      purple: '#6852F5',
      white: '#ffffff',
      darkButton: '#134757',
    },
    screens: {
      sm: '640px',
      md: '768px',
      '900px': '900px',
      lg: '1024px',
      '1100px': '1100px',
      '1200px': '1200px',
      xl: '1280px',
      '1400px': '1400px',
      '2xl': '1536px',
      menu: 'linear-gradient(180deg, #3d888d 0%, #2e4450 100%)',
    },
    extend: {
      boxShadow: {
        ball: '0 0 0 3px white, 0 0 0 4px #5284ff',
        dropdown: '-4px 18px 70px 0 rgba(108, 143, 167, 0.32)',
        popup: '0px 3px 9px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        urbanist: ['Urbanist'],
        cocoSharp: ['CocoSharp'],
      },
      gridTemplateColumns: {
        profile: '360px 1fr',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
      },
      backgroundImage: {
        'home-bg': "url('/assets/images/heroBG.png')",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#30DB9E',
          secondary: '#1EEFA4',
          accent: '#B1D6D3',
          neutral: '#00ECC1',
          info: '#BDCED1',
          success: '#218752',
          warning: '#ED7E17',
          error: '#FF0000',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
