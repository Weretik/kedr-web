import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, '..', '..');
const destinationRoot = path.join(workspaceRoot, 'docs', 'contracts', 'openapi');
const backendRoot = resolveBackendRoot(process.argv.slice(2));
const sourceRoot = path.join(backendRoot, 'docs', 'sdd', 'contracts');

await requireFile(path.join(sourceRoot, 'openapi.yaml'));
assertCleanRepository(backendRoot);

const sourceFiles = await findYamlFiles(sourceRoot);
const destinationFiles = await findYamlFiles(destinationRoot, { allowMissing: true });
const sourceRelativePaths = new Set(sourceFiles.map((file) => path.relative(sourceRoot, file)));

for (const destinationFile of destinationFiles) {
  const relativePath = path.relative(destinationRoot, destinationFile);
  if (!sourceRelativePaths.has(relativePath)) {
    await rm(destinationFile);
  }
}

for (const sourceFile of sourceFiles) {
  const relativePath = path.relative(sourceRoot, sourceFile);
  const destinationFile = path.join(destinationRoot, relativePath);
  await mkdir(path.dirname(destinationFile), { recursive: true });
  await copyFile(sourceFile, destinationFile);
}

const commit = git(backendRoot, ['rev-parse', 'HEAD']);
const sourceDocument = `# Backend OpenAPI snapshot

- Repository: \`KedrStore\`
- Source: \`docs/sdd/contracts/openapi.yaml\`
- Commit: \`${commit}\`
- Files: ${sourceFiles.length} YAML documents

This directory is machine-managed. Do not edit its YAML files in the frontend
repository. Refresh it from a clean backend checkout with:

\`\`\`text
npm run contracts:sync -- <path-to-KedrStore>
\`\`\`
`;

await mkdir(destinationRoot, { recursive: true });
await writeFile(path.join(destinationRoot, 'SOURCE.md'), sourceDocument, 'utf8');
console.log(`Synced ${sourceFiles.length} OpenAPI files from KedrStore ${commit.slice(0, 7)}.`);

function resolveBackendRoot(args) {
  const positionalArgument = args.find((argument) => !argument.startsWith('-'));
  const configuredRoot = positionalArgument ?? process.env.KEDRSTORE_ROOT;

  if (!configuredRoot) {
    throw new Error(
      'Provide the KedrStore repository path as the first argument or KEDRSTORE_ROOT.',
    );
  }

  return path.resolve(configuredRoot);
}

async function requireFile(file) {
  try {
    const entry = await stat(file);
    if (!entry.isFile()) throw new Error(`${file} is not a file.`);
  } catch (error) {
    throw new Error(`Backend OpenAPI entry point was not found: ${file}`, { cause: error });
  }
}

function assertCleanRepository(repositoryRoot) {
  const status = git(repositoryRoot, ['status', '--short']);
  if (status) {
    throw new Error('KedrStore has uncommitted changes; commit or stash them before syncing.');
  }
}

function git(repositoryRoot, arguments_) {
  return execFileSync('git', ['-C', repositoryRoot, ...arguments_], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

async function findYamlFiles(directory, { allowMissing = false } = {}) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (allowMissing && error.code === 'ENOENT') return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findYamlFiles(entryPath)));
    } else if (entry.isFile() && /[.]ya?ml$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}
