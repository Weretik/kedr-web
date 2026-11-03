import type { PrivacyPolicyCopy, PrivacyPolicyKey } from './privacy-policy-copy';
import type {
  PrivacyInline,
  PrivacyPolicyBlock,
  PrivacyPolicyBindings,
  PrivacyPolicySection,
} from './privacy-types';

export type PrivacyTocLabels = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type PrivacyParagraphKey = Extract<PrivacyPolicyKey, `privacy.section${number}.p${number}`>;
type PrivacyListKey = Extract<PrivacyPolicyKey, `privacy.section${number}.li${number}`>;

/** Replaces only the two existing contact tokens in the full §8 paragraph. */
function bindContactParagraph(
  text: string,
  bindings: PrivacyPolicyBindings,
): readonly PrivacyInline[] {
  const content: PrivacyInline[] = [];
  const contactTokens =
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\(\d{3}\) \d{3}-\d{2}-\d{2}/g;
  let offset = 0;

  for (const match of text.matchAll(contactTokens)) {
    if (match.index > offset) {
      content.push({ text: text.slice(offset, match.index) });
    }
    content.push(
      match[0].includes('@')
        ? { text: bindings.email, href: `mailto:${bindings.email}` }
        : { text: bindings.phoneDisplay, href: bindings.phoneHref },
    );
    offset = match.index + match[0].length;
  }
  if (offset < text.length) content.push({ text: text.slice(offset) });
  return content;
}

/** Complete ordered mapping; every lookup names an existing raw source key. */
export function buildPrivacyPolicySections(
  source: PrivacyPolicyCopy,
  bindings: PrivacyPolicyBindings,
  tocLabels: PrivacyTocLabels,
): readonly PrivacyPolicySection[] {
  const paragraph = (key: PrivacyParagraphKey): PrivacyPolicyBlock => {
    let text = source[key];
    if (key === 'privacy.section1.p1') {
      text = text.replace('kedr-web.vercel.app', bindings.siteHost);
    }
    if (key === 'privacy.section4.p1') {
      text = text.replace('передає його дані передаються', 'передає його дані');
    }
    return {
      kind: 'paragraph',
      sourceKey: key,
      content: key === 'privacy.section8.p1' ? bindContactParagraph(text, bindings) : [{ text }],
    };
  };

  const list = (...keys: readonly PrivacyListKey[]): PrivacyPolicyBlock => ({
    kind: 'list',
    items: keys.map((sourceKey) => ({
      sourceKey,
      content: [{ text: source[sourceKey] }],
    })),
  });

  return [
    {
      id: 'privacy-general',
      title: source['privacy.section1.title'],
      tocLabel: tocLabels[0],
      blocks: [
        paragraph('privacy.section1.p1'),
        paragraph('privacy.section1.p2'),
        paragraph('privacy.section1.p3'),
        paragraph('privacy.section1.p4'),
      ],
    },
    {
      id: 'privacy-data',
      title: source['privacy.section2.title'],
      tocLabel: tocLabels[1],
      blocks: [
        paragraph('privacy.section2.p1'),
        list('privacy.section2.li1', 'privacy.section2.li2', 'privacy.section2.li3'),
        paragraph('privacy.section2.p2'),
      ],
    },
    {
      id: 'privacy-purpose',
      title: source['privacy.section3.title'],
      tocLabel: tocLabels[2],
      blocks: [
        paragraph('privacy.section3.p1'),
        list(
          'privacy.section3.li1',
          'privacy.section3.li2',
          'privacy.section3.li3',
          'privacy.section3.li4',
        ),
      ],
    },
    {
      id: 'privacy-sharing',
      title: source['privacy.section4.title'],
      tocLabel: tocLabels[3],
      blocks: [
        paragraph('privacy.section4.p1'),
        paragraph('privacy.section4.p2'),
        paragraph('privacy.section4.p3'),
      ],
    },
    {
      id: 'privacy-storage',
      title: source['privacy.section5.title'],
      tocLabel: tocLabels[4],
      blocks: [paragraph('privacy.section5.p1'), paragraph('privacy.section5.p2')],
    },
    {
      id: 'privacy-rights',
      title: source['privacy.section6.title'],
      tocLabel: tocLabels[5],
      blocks: [
        paragraph('privacy.section6.p1'),
        list(
          'privacy.section6.li1',
          'privacy.section6.li2',
          'privacy.section6.li3',
          'privacy.section6.li4',
        ),
      ],
    },
    {
      id: 'privacy-changes',
      title: source['privacy.section7.title'],
      tocLabel: tocLabels[6],
      blocks: [paragraph('privacy.section7.p1')],
    },
    {
      id: 'privacy-contact',
      title: source['privacy.section8.title'],
      tocLabel: tocLabels[7],
      blocks: [paragraph('privacy.section8.p1')],
    },
  ];
}
