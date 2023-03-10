const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5F021F',
        secondary: '#2b0109',
        layout: '#AA7B8A',
        card: '#6f283e',
      },
    },
  },
  jit: true,
  plugins: [],
};
