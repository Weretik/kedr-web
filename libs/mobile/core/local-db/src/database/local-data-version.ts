type Listener = () => void;

let version = 0;
const listeners = new Set<Listener>();

/** Bumped after a write that screens should re-read, such as a snapshot replace. */
export function markLocalDataChanged(): void {
  version += 1;
  for (const listener of listeners) listener();
}

export function getLocalDataVersion(): number {
  return version;
}

export function subscribeLocalData(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
