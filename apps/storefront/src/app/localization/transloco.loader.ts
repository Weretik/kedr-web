import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

import {
  ruAboutTranslation,
  ukAboutTranslation,
} from './translations/about.translation';
import {
  ruArticlesTranslation,
  ukArticlesTranslation,
} from './translations/articles.translation';
import {
  ruCartTranslation,
  ukCartTranslation,
} from './translations/cart.translation';
import {
  ruCatalogTranslation,
  ukCatalogTranslation,
} from './translations/catalog.translation';
import {
  ruCheckoutTranslation,
  ukCheckoutTranslation,
} from './translations/checkout.translation';
import {
  ruContactsTranslation,
  ukContactsTranslation,
} from './translations/contacts.translation';
import {
  ruDeliveryPaymentTranslation,
  ukDeliveryPaymentTranslation,
} from './translations/delivery-payment.translation';
import {
  ruFooterTranslation,
  ukFooterTranslation,
} from './translations/footer.translation';
import {
  ruGalleriaTranslation,
  ukGalleriaTranslation,
} from './translations/galleria.translation';
import {
  ruHeaderTranslation,
  ukHeaderTranslation,
} from './translations/header.translation';
import {
  ruNotFoundTranslation,
  ukNotFoundTranslation,
} from './translations/not-found.translation';
import {
  ruPrivacyPolicyTranslation,
  ukPrivacyPolicyTranslation,
} from './translations/privacy-policy.translation';
import {
  ruPublicOfferTranslation,
  ukPublicOfferTranslation,
} from './translations/public-offer.translation';
import {
  ruRegionsTranslation,
  ukRegionsTranslation,
} from './translations/regions.translation';
import {
  ruRequisitesTranslation,
  ukRequisitesTranslation,
} from './translations/requisites.translation';
import {
  ruReturnsTranslation,
  ukReturnsTranslation,
} from './translations/returns.translation';
import { ruTranslation } from './translations/ru.translation';
import { ukTranslation } from './translations/uk.translation';
import {
  ruWholesaleTranslation,
  ukWholesaleTranslation,
} from './translations/wholesale.translation';
import {
  ruWidgetsTranslation,
  ukWidgetsTranslation,
} from './translations/widgets.translation';

const TRANSLATIONS: Record<string, Translation> = {
  uk: {
    ...ukTranslation,
    ...ukHeaderTranslation,
    ...ukNotFoundTranslation,
    ...ukFooterTranslation,
    ...ukCatalogTranslation,
    ...ukCartTranslation,
    ...ukAboutTranslation,
    ...ukArticlesTranslation,
    ...ukCheckoutTranslation,
    ...ukContactsTranslation,
    ...ukDeliveryPaymentTranslation,
    ...ukGalleriaTranslation,
    ...ukPrivacyPolicyTranslation,
    ...ukPublicOfferTranslation,
    ...ukRequisitesTranslation,
    ...ukReturnsTranslation,
    ...ukWidgetsTranslation,
    ...ukWholesaleTranslation,
    ...ukRegionsTranslation,
  },
  ru: {
    ...ruTranslation,
    ...ruHeaderTranslation,
    ...ruNotFoundTranslation,
    ...ruFooterTranslation,
    ...ruCatalogTranslation,
    ...ruCartTranslation,
    ...ruAboutTranslation,
    ...ruArticlesTranslation,
    ...ruCheckoutTranslation,
    ...ruContactsTranslation,
    ...ruDeliveryPaymentTranslation,
    ...ruGalleriaTranslation,
    ...ruPrivacyPolicyTranslation,
    ...ruPublicOfferTranslation,
    ...ruRequisitesTranslation,
    ...ruReturnsTranslation,
    ...ruWidgetsTranslation,
    ...ruWholesaleTranslation,
    ...ruRegionsTranslation,
  },
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['uk']);
  }
}
