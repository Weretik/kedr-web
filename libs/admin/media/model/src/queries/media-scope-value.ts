import type { MediaScope } from './media-files-query';

const allValue = 'all';
const rootValue = 'root';

/** The select value of a scope: `all`, `root`, or the folder ID. */
export function mediaScopeValue(scope: MediaScope): string {
  if (scope.kind === 'folder') return String(scope.folderId);
  return scope.kind === 'root' ? rootValue : allValue;
}

export function mediaScopeFromValue(value: string): MediaScope {
  if (value === allValue) return { kind: 'all' };
  if (value === rootValue) return { kind: 'root' };
  return { kind: 'folder', folderId: Number(value) };
}
