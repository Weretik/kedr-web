const path = require('path');

const toRelative = (files) =>
  files.map((file) => path.relative(process.cwd(), file));

/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,js,html,css,scss,json,md}': (files) => {
    const relativeFiles = toRelative(files);
    return `npx prettier --write ${relativeFiles.join(' ')}`;
  },
  '*.{ts,js}': (files) => {
    const relativeFiles = toRelative(files);
    return `npx nx affected -t lint --files ${relativeFiles.join(',')}`;
  },
};
