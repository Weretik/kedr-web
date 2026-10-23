/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,tsx,js,jsx,mts,mjs,html,css,scss,json,md}': ['npx prettier --write'],
  '*.{ts,tsx,js,jsx,mts,mjs}': ['npx eslint --fix'],
};
