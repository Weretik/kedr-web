// Runs `npm ls --all` and fails on every problem except those inside optional packages of the lockfile.
//
// npm installs platform-neutral optional packages (for example the WebAssembly builds of sharp and oxc-parser)
// even when the package that wants them is skipped on this platform, and then `npm ls` reports them as
// extraneous or as the wrong version. Such packages are never loaded on Linux, so they cannot break the
// build; anything else (a missing, invalid, or extraneous required package) still fails this check.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lock = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8'));

let output;
try {
  output = execFileSync('npm', ['ls', '--all', '--json'], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
} catch (error) {
  output = error.stdout;
}

const problems = JSON.parse(output).problems ?? [];
const isOptional = (problem) => {
  const location = problem.split(' ').at(-1);
  const key = path.relative(root, location).split(path.sep).join('/');
  return lock.packages?.[key]?.optional === true;
};

const ignored = problems.filter(isOptional);
const blocking = problems.filter((problem) => !isOptional(problem));

for (const problem of ignored) console.log(`ignored (optional package): ${problem}`);
for (const problem of blocking) console.error(`dependency problem: ${problem}`);

if (blocking.length) process.exit(1);
console.log(
  `Dependency tree is valid (${ignored.length} optional platform package notices ignored).`,
);
