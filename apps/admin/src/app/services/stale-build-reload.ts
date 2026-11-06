const reloadedAtKey = 'kedr-admin:stale-build-reloaded-at';
const retryAfterMs = 60_000;

/**
 * After a deploy an open tab still runs the old build, and its lazy page files no longer exist on the
 * server (the host answers them with index.html). Vite reports that as `vite:preloadError`; reload the
 * tab once to pick up the new build. A second failure within a minute is left to the error boundary,
 * so a real outage does not loop.
 */
export function reloadOnStaleBuild(target: Window = window): void {
  target.addEventListener('vite:preloadError', (event) => {
    const now = Date.now();
    let last = 0;
    try {
      last = Number(target.sessionStorage.getItem(reloadedAtKey)) || 0;
    } catch {
      // Storage blocked: reload anyway, the guard is only a convenience.
    }
    if (now - last < retryAfterMs) return;

    event.preventDefault();
    try {
      target.sessionStorage.setItem(reloadedAtKey, String(now));
    } catch {
      // Ignore: without storage the next failure reloads again, at most once per page load.
    }
    target.location.reload();
  });
}
