import {
  DeliveryContact,
  DeliveryPageHeader,
  DeliverySections,
  getDeliveryPaymentDictionary,
} from '@site/content/ui';
import { getCompanyContacts } from '@site/shared/company';

import { loadLegalDocument } from './documents/load-legal-document';

import type { Locale } from '@site/core/i18n';

/** Delivery & payment terms from the admin inside the locale layout's existing SiteShell. */
export async function DeliveryPaymentPage({ locale }: { locale: Locale }) {
  const dictionary = getDeliveryPaymentDictionary(locale);
  const contacts = await getCompanyContacts();
  const document = await loadLegalDocument(locale, 'delivery-payment', contacts, 'delivery');

  return (
    <div className="space-y-10 sm:space-y-12">
      <DeliveryPageHeader locale={locale} dictionary={dictionary} document={document} />
      <DeliverySections sections={document.sections} />
      <div className="max-w-md">
        <DeliveryContact dictionary={dictionary} phone={contacts.phone} />
      </div>
    </div>
  );
}
