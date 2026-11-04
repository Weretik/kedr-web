import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join, relative } from 'node:path';

// Typechecks every tsconfig.spec.json of the selected scopes, several tsc processes at a time.
//   node tools/testing/typecheck-tests.mjs <scope...|all>
// With CI_SCOPE=affected (pull-request CI) only projects affected since NX_BASE are checked.
const workspaceRoot = new URL('../../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1');
const scopes = {
  web: ['apps/admin', 'libs/admin'],
  storefront: ['apps/storefront', 'libs/storefront'],
  mobile: ['apps/mobile', 'libs/mobile'],
  site: ['apps/site', 'libs/site'],
  e2e: ['apps/admin-e2e'],
};
const specConfigName = { e2e: 'tsconfig.json' };

const args = process.argv.slice(2);
const selected = args.includes('all') ? Object.keys(scopes) : args;
if (selected.length === 0 || selected.some((scope) => !(scope in scopes))) {
  console.error(
    `Usage: node tools/testing/typecheck-tests.mjs <${Object.keys(scopes).join('|')}|all>...`,
  );
  process.exit(2);
}

function findConfigs(directory, name) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules') return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return name === 'tsconfig.json' ? [] : findConfigs(path, name);
    return entry.name === name ? [path] : [];
  });
}

function projectName(config) {
  const projectFile = join(dirname(config), 'project.json');
  return existsSync(projectFile) ? JSON.parse(readFileSync(projectFile, 'utf8')).name : undefined;
}

let configs = selected.flatMap((scope) =>
  scopes[scope].flatMap((root) =>
    findConfigs(join(workspaceRoot, root), specConfigName[scope] ?? 'tsconfig.spec.json'),
  ),
);

if (process.env.CI_SCOPE === 'affected') {
  const affected = new Set(
    JSON.parse(
      execFileSync('npx', ['nx', 'show', 'projects', '--affected', '--json'], {
        cwd: workspaceRoot,
        encoding: 'utf8',
      }),
    ),
  );
  const skipped = configs.filter((config) => !affected.has(projectName(config)));
  configs = configs.filter((config) => affected.has(projectName(config)));
  console.log(`Skipped ${skipped.length} unaffected projects.`);
}

function typecheck(config) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['node_modules/typescript/bin/tsc', '-p', config, '--noEmit'],
      {
        cwd: workspaceRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => {
      const status = code === 0 ? 'ok' : 'FAILED';
      console.log(`Typechecking ${relative(workspaceRoot, config)}: ${status}`);
      if (output) process.stdout.write(output);
      resolve(code === 0);
    });
  });
}

const queue = [...configs];
let failed = false;
const workers = Array.from({ length: Math.min(availableParallelism(), queue.length) }, async () => {
  while (queue.length > 0) {
    if (!(await typecheck(queue.shift()))) failed = true;
  }
});
await Promise.all(workers);
process.exit(failed ? 1 : 0);
