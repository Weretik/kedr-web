import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SeoSettingsView } from './seo-settings-view';

describe('SeoSettingsView', () => {
  it('says what is not set and that pages keep the site picture', () => {
    render(
      <SeoSettingsView
        settings={{
          googleAnalyticsId: null,
          googleTagManagerId: 'GTM-AB12CD3',
          googleSiteVerification: null,
          bingSiteVerification: null,
          sharePicture: null,
          updatedAt: '2026-11-12T00:00:00Z',
          updatedBy: null,
        }}
      />,
    );

    expect(screen.getByText('GTM-AB12CD3')).toBeDefined();
    expect(screen.getAllByText('Не вказано')).toHaveLength(3);
    expect(screen.getByText(/стандартне фото сайту/)).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
