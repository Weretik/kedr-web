/** What a write changed; a screen re-reads only when its own kind of data changed. */
export type LocalDataScope = 'calculation' | 'catalog' | 'customers';

type Listener = () => void;

const versions: Record<LocalDataScope, number> = { calculation: 0, catalog: 0, customers: 0 };
const listeners = new Set<Listener>();

/**
 * Bumped after a write that screens should re-read, such as a snapshot replace. Without scopes every kind of data
 * counts as changed (sign-out wipe).
 */
export function markLocalDataChanged(...scopes: LocalDataScope[]): void {
  const changed = scopes.length > 0 ? scopes : (Object.keys(versions) as LocalDataScope[]);
  for (const scope of changed) versions[scope] += 1;
  for (const listener of listeners) listener();
}

export function getLocalDataVersion(scope: LocalDataScope): number {
  return versions[scope];
}

export function subscribeLocalData(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
