import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SeoSettingsPage } from './seo-settings-page';

import type { SeoSettings } from '@admin/seo-settings/model';

const api = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));

vi.mock('@admin/seo-settings/data-access', () => ({
  useGetSeoSettingsQuery: api.get,
  useUpdateSeoSettingsMutation: () => [api.update, { isLoading: false }],
}));

vi.mock('@admin/media/data-access', () => ({
  useGetMediaFilesQuery: () => ({ data: undefined, isFetching: false, isError: false }),
  useUploadMediaFileMutation: () => [vi.fn(), { isLoading: false }],
}));

const settings: SeoSettings = {
  googleAnalyticsId: 'G-AB12CD34EF',
  googleTagManagerId: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
  sharePicture: {
    mediaFileId: 7,
    url: null,
    fileName: null,
    width: null,
    height: null,
    missing: true,
  },
  updatedAt: '2026-11-12T10:00:00Z',
  updatedBy: 'seo@classkedr.com.ua',
};

describe('SeoSettingsPage', () => {
  beforeEach(() => {
    api.get
      .mockReset()
      .mockReturnValue({ data: settings, isError: false, isLoading: false, refetch: vi.fn() });
    api.update.mockReset();
  });

  it('shows the codes read-only and marks a deleted picture', () => {
    render(<SeoSettingsPage />);

    expect(screen.getByText('G-AB12CD34EF')).toBeDefined();
    expect(screen.getAllByText('Не вказано')).toHaveLength(3);
    expect(screen.getByText(/Файл фото видалено з медіатеки/)).toBeDefined();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('saves the codes from the side panel, taking the code out of a pasted meta tag', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(settings) });
    render(<SeoSettingsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Підтвердження Google Search Console' }), {
      target: { value: '<meta name="google-site-verification" content="AbCdEf_123-xyz" />' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати фото' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.update).toHaveBeenCalledOnce());
    expect(api.update.mock.calls[0][0]).toMatchObject({
      googleAnalyticsId: 'G-AB12CD34EF',
      googleSiteVerification: '<meta name="google-site-verification" content="AbCdEf_123-xyz" />',
      sharePicture: null,
    });
    expect(await screen.findByText(/Сайт покаже зміни/)).toBeDefined();
  });

  it('does not save an id of another shape', () => {
    render(<SeoSettingsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Google Tag Manager' }), {
      target: { value: 'UA-1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText('Ідентифікатор має вигляд GTM-AB12CD3.')).toBeDefined();
    expect(api.update).not.toHaveBeenCalled();
  });
});
