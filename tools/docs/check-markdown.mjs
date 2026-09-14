import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';

const workspaceRoot = new URL('../../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1');
const docsRoot = join(workspaceRoot, 'docs');

function findMarkdown(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? findMarkdown(path) : extname(entry.name) === '.md' ? [path] : [];
  });
}

const files = findMarkdown(docsRoot);
const errors = [];
const hashes = new Map();
const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const displayPath = relative(workspaceRoot, file);

  if (!content.trim()) errors.push(`${displayPath}: empty Markdown file`);

  const hash = createHash('sha256').update(content.trim()).digest('hex');
  const duplicate = hashes.get(hash);
  if (duplicate) errors.push(`${displayPath}: duplicates ${duplicate}`);
  else hashes.set(hash, displayPath);

  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1]
      .trim()
      .replace(/^<|>$/g, '')
      .split(/\s+["']/)[0];
    if (
      !rawTarget ||
      rawTarget.includes('<') ||
      rawTarget.includes('>') ||
      rawTarget.startsWith('#') ||
      /^[a-z][a-z+.-]*:/i.test(rawTarget)
    )
      continue;

    const pathPart = decodeURIComponent(rawTarget.split('#')[0].split('?')[0]);
    const target = normalize(resolve(dirname(file), pathPart));
    if (!existsSync(target)) errors.push(`${displayPath}: missing link target ${rawTarget}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Checked ${files.length} Markdown files: links, empty files and duplicate content are valid.`,
);
