import type { ukReturnsPolicy } from './returns-policy-copy';
import type { ReturnsPolicySection } from './returns-types';

type ReturnsPolicyKey = keyof typeof ukReturnsPolicy;
type ReturnsPolicyCopy = Readonly<Record<ReturnsPolicyKey, string>>;

/** Complete policy mapping: each lookup must name an existing source key. */
export function buildReturnsPolicySections(
  source: ReturnsPolicyCopy,
): readonly ReturnsPolicySection[] {
  const text = (key: ReturnsPolicyKey) => source[key];
  return [
    {
      title: text('returns.s1.title'),
      items: [
        text('returns.s1.term'),
        text('returns.s1.conditions'),
        text('returns.s1.documents'),
        text('returns.s1.restrictions'),
      ],
    },
    {
      title: text('returns.s2.title'),
      sections: [
        {
          title: text('returns.s2.sellerTitle'),
          intro: text('returns.s2.sellerLead'),
          items: [text('returns.s2.sellerItem1'), text('returns.s2.sellerItem2')],
        },
        {
          title: text('returns.s2.visualTitle'),
          intro: text('returns.s2.visualLead'),
          items: [
            text('returns.s2.visualItem1'),
            text('returns.s2.visualItem2'),
            text('returns.s2.visualItem3'),
          ],
        },
      ],
    },
    {
      title: text('returns.s3.title'),
      paragraphs: [text('returns.s3.transport')],
      sections: [
        {
          title: text('returns.s3.deliveryTitle'),
          items: [text('returns.s3.deliveryItem1'), text('returns.s3.deliveryItem2')],
        },
      ],
    },
    {
      title: text('returns.s4.title'),
      intro: text('returns.s4.lead'),
      sections: (
        [
          ['returns.s4.step1Title', 'returns.s4.step1Text'],
          ['returns.s4.step2Title', 'returns.s4.step2Text'],
          ['returns.s4.step3Title', 'returns.s4.step3Text'],
        ] as const
      ).map(([title, paragraph]) => ({
        title: text(title),
        paragraphs: [text(paragraph)],
      })),
    },
  ];
}
