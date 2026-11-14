import { useEffect, useRef, useState } from 'react';

const SEARCH_DELAY_MS = 300;

/**
 * The search field over a URL search term: typing commits after a pause, and a URL change
 * from outside the field (another tab, back button) replaces the field text.
 */
export function useDebouncedSearch(
  urlTerm: string,
  mode: string,
  commit: (text: string) => void,
) {
  const [text, setText] = useState(urlTerm);
  const [synced, setSynced] = useState({ mode, urlTerm });
  if (synced.mode !== mode || synced.urlTerm !== urlTerm) {
    setSynced({ mode, urlTerm });
    setText(urlTerm);
  }

  const commitRef = useRef(commit);
  useEffect(() => {
    commitRef.current = commit;
  });

  useEffect(() => {
    if (text === urlTerm) return;
    const timeout = window.setTimeout(() => commitRef.current(text), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [text, urlTerm]);

  return { text, setText };
}
