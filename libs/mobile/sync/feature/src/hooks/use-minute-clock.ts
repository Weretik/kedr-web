import { useEffect, useState } from 'react';

/** The current time, refreshed every minute, for labels such as «дані від 14:05». */
export function useMinuteClock(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return now;
}
