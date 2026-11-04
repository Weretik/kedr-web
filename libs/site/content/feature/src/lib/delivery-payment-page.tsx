import {
  DeliveryContact,
  DeliveryPageHeader,
  DeliveryPaymentTerms,
  ImportantTerms,
  OrderSteps,
  getDeliveryPaymentDictionary,
} from '@site/content/ui';
import { getCompanyContacts } from '@site/shared/company';

import type { Locale } from '@site/core/i18n';

/** Static content inside the locale layout's existing SiteShell. */
export async function DeliveryPaymentPage({ locale }: { locale: Locale }) {
  const dictionary = getDeliveryPaymentDictionary(locale);
  const { phone } = await getCompanyContacts();

  return (
    <div className="space-y-10 sm:space-y-12">
      <DeliveryPageHeader locale={locale} dictionary={dictionary} />
      <DeliveryPaymentTerms dictionary={dictionary} />
      <OrderSteps dictionary={dictionary} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-12">
        <ImportantTerms locale={locale} dictionary={dictionary} />
        <DeliveryContact dictionary={dictionary} phone={phone} />
      </div>
    </div>
  );
}
