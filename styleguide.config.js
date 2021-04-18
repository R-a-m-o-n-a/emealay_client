const path = require('path');

module.exports = {
  // components: './src/components/*.jsx',
  title: 'Emealay Documentation',
  pagePerSection: true,
  exampleMode: 'hide', // 'hide' | 'collapse' | 'expand'
  usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
  ignore: ['**/*.util.{jsx,js}', '**/use*.{jsx,js}'], // Styleguidist can only document components, not pure functions or Hooks. That is why these must be ignored.
  styleguideDir: './docs',
  sections: [
    {
      name: 'Button Components',
      description: 'Different Buttons or clickable Icons and Text',
      components: './src/components/Buttons/*.jsx',
    },
    {
      name: 'Image Components',
      description: 'Everything related to uploading and displaying images',
      components: './src/components/Images/*.jsx',
    },
    {
      name: 'Meal Components',
      components: './src/components/Meals/*.jsx',
    },
    {
      name: 'Plan Components',
      components: './src/components/Plans/*.jsx',
    },
    {
      name: 'Settings Components',
      components: './src/components/Settings/*.jsx',
    },
    {
      name: 'Social/Contacts Components',
      components: './src/components/Social/*.jsx',
    },
    {
      name: 'Util Components',
      components: ['./src/components/util/*.jsx'],
    },
  ],
}
