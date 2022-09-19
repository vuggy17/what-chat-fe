const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  media: false, // or 'media' or 'class'
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        primary: '#128C7E',
        'primary-1': '#D1E4E8',
        'gray-border': '#d9d9d9',
        'gray-1': '#00000073',
        'gray-2': '#EBEBEB',
        'gray-3': '#dbdbdb',
      },
      // transitionTimingFunction: {
      //   'selected-conv': 'cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1)',
      //   'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      // },
      animation: {
        'select-conv':
          '.15s cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
