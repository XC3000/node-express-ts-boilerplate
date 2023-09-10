// module.exports = {
//   plugins: [require("prettier-plugin-tailwindcss")],
//   tailwindConfig: "./tailwind.config.js",
// };

// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindAttributes: ['classNames'],
  singleQuote: true,
  bracketSpacing: true,
  printWidth: 120,
};
