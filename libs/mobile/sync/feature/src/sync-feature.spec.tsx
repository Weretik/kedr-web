import { customers, LocalDatabaseProvider, type LocalDatabase } from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { SyncProvider } from './components/sync-provider';
import { SyncStatusStrip } from './components/sync-status-strip';
import { syncStatusActions, useSyncStatus } from './state/sync-status-store';

import type { SnapshotFetcher } from '@mobile/sync/data-access';

const catalogBody = {
  version: 'v1',
  generatedAt: '2026-11-05T09:00:00Z',
  retailPriceTypeId: 12,
  priceTypes: [],
  categories: [],
  products: [],
};
const customersBody = {
  version: 'c1',
  generatedAt: '2026-11-05T09:00:00Z',
  customers: [
    {
      counterpartyId: 'c-1',
      name: 'Альфа',
      phone: null,
      email: 'a@x',
      defaultPriceTypeId: 12,
      categoryPriceTypes: [],
      debt: null,
      balance: null,
    },
  ],
};

const okServer: SnapshotFetcher = async (resource) => ({
  kind: 'updated',
  etag: `"${resource}"`,
  body: resource === 'catalog' ? catalogBody : customersBody,
});

describe('SyncProvider', () => {
  let db: LocalDatabase;
  beforeEach(() => {
    db = createTestLocalDatabase();
    syncStatusActions.reset();
  });

  it('shows the first sync and then the working area with the data stored', async () => {
    await render(
      <LocalDatabaseProvider database={db}>
        <SyncProvider fetcher={okServer} isOnline>
          <Text>Робоча зона</Text>
        </SyncProvider>
      </LocalDatabaseProvider>,
    );

    expect(await screen.findByText('Робоча зона')).toBeTruthy();
    expect(db.select().from(customers).all()).toHaveLength(1);
  });

  it('asks for a network before the first sync', async () => {
    await render(
      <LocalDatabaseProvider database={db}>
        <SyncProvider fetcher={okServer} isOnline={false}>
          <Text>Робоча зона</Text>
        </SyncProvider>
      </LocalDatabaseProvider>,
    );

    expect(await screen.findByText('Немає мережі')).toBeTruthy();
    expect(screen.queryByText('Робоча зона')).toBeNull();
  });

  it('offers a retry when the first sync fails', async () => {
    const failing: SnapshotFetcher = async () => ({ kind: 'failed', reason: 'server' });

    await render(
      <LocalDatabaseProvider database={db}>
        <SyncProvider fetcher={failing} isOnline>
          <Text>Робоча зона</Text>
        </SyncProvider>
      </LocalDatabaseProvider>,
    );

    expect(await screen.findByText('Дані не завантажено')).toBeTruthy();
    expect(screen.getByText('Спробувати ще')).toBeTruthy();
  });

  it('opens the working area offline when data was synced before', async () => {
    await render(
      <LocalDatabaseProvider database={db}>
        <SyncProvider fetcher={okServer} isOnline>
          <Text>Робоча зона</Text>
        </SyncProvider>
      </LocalDatabaseProvider>,
    );
    await screen.findByText('Робоча зона');
    await act(async () => syncStatusActions.reset());

    await render(
      <LocalDatabaseProvider database={db}>
        <SyncProvider fetcher={okServer} isOnline={false}>
          <Text>Знову</Text>
        </SyncProvider>
      </LocalDatabaseProvider>,
    );

    expect(await screen.findByText('Знову')).toBeTruthy();
  });
});

describe('SyncStatusStrip', () => {
  beforeEach(() => syncStatusActions.reset());

  it('shows the data time while offline', async () => {
    const syncedAt = new Date(2026, 10, 5, 14, 5).getTime();
    await act(async () => syncStatusActions.loaded({ catalog: syncedAt, customers: syncedAt }));

    await render(<SyncStatusStrip isOnline={false} layout="bar" now={syncedAt + 60_000} />);

    expect(screen.getByText('Без мережі · дані від 14:05')).toBeTruthy();
  });

  it('shows nothing online with fresh data', async () => {
    const syncedAt = Date.now();
    await act(async () => syncStatusActions.loaded({ catalog: syncedAt, customers: syncedAt }));

    await render(<SyncStatusStrip isOnline layout="bar" now={syncedAt} />);

    expect(screen.queryByTestId('sync-status-strip')).toBeNull();
    expect(useSyncStatus.getState().running).toBe(false);
  });
});
