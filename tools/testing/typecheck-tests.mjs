import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const workspaceRoot = new URL('../../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1');
const scopes = {
  web: ['apps/admin', 'libs/admin'],
  mobile: ['apps/mobile', 'libs/mobile'],
};
const selectedScope = process.argv[2];

if (!(selectedScope in scopes)) {
  console.error('Usage: node tools/testing/typecheck-tests.mjs <web|mobile>');
  process.exit(2);
}

function findSpecConfigs(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findSpecConfigs(path);
    return entry.name === 'tsconfig.spec.json' ? [path] : [];
  });
}

const configs = scopes[selectedScope]
  .flatMap((root) => findSpecConfigs(join(workspaceRoot, root)))
  .filter((path) => statSync(path).isFile());

for (const config of configs) {
  const displayPath = relative(workspaceRoot, config);
  console.log(`Typechecking ${displayPath}`);
  const result = spawnSync(
    process.execPath,
    ['node_modules/typescript/bin/tsc', '-p', config, '--noEmit'],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
