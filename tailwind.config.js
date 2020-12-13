const { colors: tailwindColors } = require('tailwindcss/defaultTheme');

const colors = {
  ...tailwindColors,
  primary: {
    DEFAULT: '#1C667A', // TEAL 600
    hover: '#113D49', // TEAL 700
  },
  secondary: {
    DEFAULT: '#edf2f7', // GRAY 200
  },
  cta: {
    DEFAULT: '#FFB838', // YELLOW 500
    hover: '#E6A632', // YELLOW 600
  },
  white: {
    DEFAULT: '#fff', // WHITE DEFAULT
    dark: '#212732', // CUSTOM COLOR
  },
  overlay: '#00000040', // CUSTOM COLOR
  google: {
    DEFAULT: '#fff', // WHITE DEFAULT
    hover: '#edf2f7', // GRAY 200
    border: '#a0aec0', // GRAY 500
  },
  gitlab: {
    DEFAULT: '#805ad5', // PURPLE 600
    hover: '#6b46c1', // PURPLE 700
  },
  github: {
    DEFAULT: '#2a4365', // BLUE 900
    hover: '#a0aec0', // GRAY 500
  },
};

module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],

  theme: {
    darkSelector: '.dark-mode',
    screens: {
      xs: { max: '480px' },
      sm: { min: '481px', max: '768px' },
      md: { min: '769px', max: '1024px' },
      lg: { min: '1025px' },
      xssm: { max: '768px' },
      smmd: { min: '481px', max: '1024px' },
      mdlg: { min: '769px' },
    },
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
      0: '0',
      45: '45deg',
      90: '90deg',
      135: '135deg',
      180: '180deg',
      270: '270deg',
    },
    fontFamily: {
      display: ['Quicksand', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
      sans: ['Quicksand'],
    },
    extend: {
      colors,
      fill: colors,
    },
  },
  darkMode: 'class',
  variants: {
    extend: {
      borderColor: ['responsive', 'focus'],
      backgroundColor: ['responsive', 'hover', 'disabled'],
      textColor: ['responsive', 'hover'],
      cursor: ['disabled'],
    },
  },
  plugins: [...require('tailwindcssdu')],
};

