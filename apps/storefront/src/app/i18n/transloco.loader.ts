import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

import {
  ruAboutTranslation,
  ukAboutTranslation,
} from './translations/about.translation';
import {
  ruCatalogTranslation,
  ukCatalogTranslation,
} from './translations/catalog.translation';
import {
  ruFooterTranslation,
  ukFooterTranslation,
} from './translations/footer.translation';
import {
  ruHeaderTranslation,
  ukHeaderTranslation,
} from './translations/header.translation';
import { ruTranslation } from './translations/ru.translation';
import { ukTranslation } from './translations/uk.translation';

const TRANSLATIONS: Record<string, Translation> = {
  uk: {
    ...ukTranslation,
    ...ukHeaderTranslation,
    ...ukFooterTranslation,
    ...ukCatalogTranslation,
    ...ukAboutTranslation,
  },
  ru: {
    ...ruTranslation,
    ...ruHeaderTranslation,
    ...ruFooterTranslation,
    ...ruCatalogTranslation,
    ...ruAboutTranslation,
  },
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['uk']);
  }
}
