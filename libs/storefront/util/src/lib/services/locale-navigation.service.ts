import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

export type StorefrontLocale = 'uk' | 'ru';

@Injectable({ providedIn: 'root' })
export class LocaleNavigationService {
  private readonly localeStorageKey = 'storefront.locale';
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorageService);

  getCurrentLocale(): StorefrontLocale {
    const path = this.document.location?.pathname || '';
    const match = path.match(/^\/(uk|ru)(?=\/|$)/);
    if (match?.[1] === 'uk' || match?.[1] === 'ru') {
      return match[1];
    }

    const savedLocale = this.storage.getItem(this.localeStorageKey);
    if (savedLocale === 'uk' || savedLocale === 'ru') {
      return savedLocale;
    }

    return 'uk';
  }

  saveLocale(locale: StorefrontLocale): void {
    this.storage.setItem(this.localeStorageKey, locale);
  }

  localizedSegments(...segments: string[]): string[] {
    return [
      '/',
      this.getCurrentLocale(),
      ...segments.map(this.normalizeSegment),
    ];
  }

  localizedPath(path: string): string[] {
    const segments = path.split('/').filter(Boolean);
    return this.localizedSegments(...segments);
  }

  stripLocalePrefix(path: string): string {
    const withoutLocale = path.replace(/^\/(uk|ru)(?=\/|$)/, '') || '/';
    return withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
  }

  private normalizeSegment(segment: string): string {
    return segment.replace(/^\/+|\/+$/g, '');
  }
}
