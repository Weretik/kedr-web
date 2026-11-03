import { ruReturnsPolicy, ukReturnsPolicy } from './returns-policy-copy';
import { buildReturnsPolicySections } from './returns-policy-sections';
import { RETURNS_SUMMARIES } from './returns-summary-copy';

import type { ReturnsDictionary } from './returns-types';
import type { Locale } from '@site/core/i18n';

export function getReturnsDictionary(locale: Locale): ReturnsDictionary {
  const source = locale === 'uk' ? ukReturnsPolicy : ruReturnsPolicy;
  return {
    locale,
    ...RETURNS_SUMMARIES[locale],
    policyTitle: source['returns.page.title'],
    policyLead: source['returns.page.lead'],
    policy: buildReturnsPolicySections(source),
    questions: [
      {
        title:
          locale === 'uk'
            ? 'Протягом якого терміну можна повернути товар?'
            : 'В течение какого срока можно вернуть товар?',
        text: source['returns.s1.term'],
      },
      {
        title:
          locale === 'uk'
            ? 'Хто оплачує доставку повернення?'
            : 'Кто оплачивает доставку возврата?',
        text: source['returns.s3.deliveryItem1'] + ' ' + source['returns.s3.deliveryItem2'],
      },
      {
        title: locale === 'uk' ? 'Коли повертаються кошти?' : 'Когда возвращаются деньги?',
        text: source['returns.s4.step3Text'],
      },
    ],
  };
}
