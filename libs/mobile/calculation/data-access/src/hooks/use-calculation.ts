import { useLocalDatabase, useLocalDataVersion, type LocalDatabase } from '@mobile/core/local-db';
import { useEffect, useEffectEvent, useMemo } from 'react';

import { orderWorkspaceApi, type OrderWorkspaceApi } from '../api/order-workspace-api';
import { drainOutbox } from '../runner/outbox-runner';
import { deviceEnvironment, type QueueEnvironment } from '../store/calculation-actions';
import { readCalculation, type StoredCalculation } from '../store/calculation-store';
import { readOutbox } from '../store/outbox-store';

import type { OutboxEntry } from '@mobile/calculation/model';

export function useStoredCalculation(counterpartyId: string): StoredCalculation {
  const db = useLocalDatabase();
  const version = useLocalDataVersion('calculation');
  return useMemo(() => {
    void version; // re-runs the read after every change
    return readCalculation(db, counterpartyId);
  }, [db, counterpartyId, version]);
}

export function useOutbox(): OutboxEntry[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion('calculation');
  return useMemo(() => {
    void version; // re-runs the read after every change
    return readOutbox(db);
  }, [db, version]);
}

let running = false;
let runAgain = false;

/** One pass at a time; a change that lands while a pass runs gets one more pass afterwards. */
function startDrain(db: LocalDatabase, api: OrderWorkspaceApi, env: QueueEnvironment): void {
  if (running) {
    runAgain = true;
    return;
  }
  running = true;
  void drainOutbox(db, api, env).finally(() => {
    running = false;
    if (runAgain) {
      runAgain = false;
      startDrain(db, api, env);
    }
  });
}

/**
 * Runs the send queue while online: on start, when the network returns, after every queue change, and when the
 * next retry is due (R-011, SC-016).
 */
export function useOutboxRunner(
  isOnline: boolean | null,
  api: OrderWorkspaceApi = orderWorkspaceApi,
  env: QueueEnvironment = deviceEnvironment,
): void {
  const db = useLocalDatabase();
  const entries = useOutbox();
  const nextAttemptAt = entries
    .filter((entry) => entry.state === 'pending')
    .reduce<number | null>(
      (soonest, entry) =>
        soonest === null ? entry.nextAttemptAt : Math.min(soonest, entry.nextAttemptAt),
      null,
    );

  const run = useEffectEvent(() => startDrain(db, api, env));

  useEffect(() => {
    if (isOnline !== true || nextAttemptAt === null) return;
    const delay = Math.max(0, nextAttemptAt - env.now());
    const timer = setTimeout(run, delay);
    return () => clearTimeout(timer);
  }, [isOnline, nextAttemptAt, env]);
}
