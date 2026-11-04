import { getPrivacyDictionary } from './privacy-dictionary';
import { ruPrivacyPolicy, ukPrivacyPolicy, type PrivacyPolicyKey } from './privacy-policy-copy';

import type { PrivacyInline, PrivacyPolicyBindings, PrivacyPolicySection } from './privacy-types';

const bindings: PrivacyPolicyBindings = {
  siteHost: 'preview.privacy.example:8443',
  email: 'privacy.request@example.test',
  phoneDisplay: '(099) 123-45-67',
  phoneHref: 'tel:+380991234567',
};

const cases = [
  { locale: 'uk' as const, source: ukPrivacyPolicy },
  { locale: 'ru' as const, source: ruPrivacyPolicy },
];

const expectedIds = [
  'privacy-general',
  'privacy-data',
  'privacy-purpose',
  'privacy-sharing',
  'privacy-storage',
  'privacy-rights',
  'privacy-changes',
  'privacy-contact',
];

const expectedTocLabels = {
  uk: [
    'Загальні положення',
    'Склад персональних даних',
    'Мета обробки',
    'Передача третім особам',
    'Захист та збереження',
    'Права користувача',
    'Зміни у політиці',
    'Контактна інформація',
  ],
  ru: [
    'Общие положения',
    'Состав персональных данных',
    'Цель обработки',
    'Передача третьим лицам',
    'Защита и хранение',
    'Права пользователя',
    'Изменения политики',
    'Контактная информация',
  ],
};

// Independent expectations for only the permitted source transformations.
const expectedBoundParagraphs: Record<'uk' | 'ru', Partial<Record<PrivacyPolicyKey, string>>> = {
  uk: {
    'privacy.section1.p1': `1.1. Дана Політика конфіденційності (далі — Політика) визначає порядок обробки та захисту персональних даних Користувачів, які збираються під час використання веб-сайту ${bindings.siteHost} (далі — Сайт).`,
    'privacy.section4.p1':
      '4.1. Користувач погоджується з тим, що Адміністрація передає його дані безпосередньому Продавцю (ФОП), який здійснює опрацювання конкретного Замовлення.',
    'privacy.section8.p1': `8.1. З питань обробки персональних даних або для їх видалення, ви можете звернутися до Адміністрації сайту за електронною адресою: ${bindings.email} або за телефоном: ${bindings.phoneDisplay}.`,
  },
  ru: {
    'privacy.section1.p1': `1.1. Данная Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты персональных данных Пользователей, которые собираются при использовании веб-сайта ${bindings.siteHost} (далее — Сайт).`,
    'privacy.section8.p1': `8.1. По вопросам обработки персональных данных или для их удаления вы можете обратиться в Администрацию сайта по электронной почте: ${bindings.email} или по телефону: ${bindings.phoneDisplay}.`,
  },
};

const text = (content: readonly PrivacyInline[]) => content.map((inline) => inline.text).join('');

function flatten(sections: readonly PrivacyPolicySection[]): string[] {
  return sections.flatMap((section) => [
    section.title,
    ...section.blocks.flatMap((block) =>
      block.kind === 'paragraph'
        ? [text(block.content)]
        : block.items.map((item) => text(item.content)),
    ),
  ]);
}

it.each(['uk', 'ru'] as const)('provides all eight full policy sections for %s', (locale) => {
  expect(getPrivacyDictionary(locale, bindings).sections).toHaveLength(8);
});

it.each(cases)(
  'preserves all 34 source units, their order and list structure for $locale',
  ({ locale, source }) => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const sections = dictionary.sections;
    const blocks = sections.flatMap((section) => section.blocks);
    const sourceEntries = Object.entries(source).filter(([key]) =>
      /^privacy\.section[1-8]\./.test(key),
    );
    const expectedText = sourceEntries.map(
      ([key, value]) => expectedBoundParagraphs[locale][key as PrivacyPolicyKey] ?? value,
    );

    expect(sourceEntries).toHaveLength(34);
    expect(sections.map((section) => section.id)).toEqual(expectedIds);
    expect(sections.map((section) => section.tocLabel)).toEqual(expectedTocLabels[locale]);
    expect(flatten(sections)).toEqual(expectedText);
    expect(blocks.filter((block) => block.kind === 'paragraph')).toHaveLength(15);
    expect(blocks.flatMap((block) => (block.kind === 'list' ? block.items : []))).toHaveLength(11);
    expect(sections[1].blocks.map((block) => block.kind)).toEqual([
      'paragraph',
      'list',
      'paragraph',
    ]);
    expect(
      blocks.flatMap((block) =>
        block.kind === 'paragraph' ? [block.sourceKey] : block.items.map((item) => item.sourceKey),
      ),
    ).toEqual(sourceEntries.filter(([key]) => !key.endsWith('.title')).map(([key]) => key));
    expect(dictionary.relatedOffer).toEqual({
      heading: source['privacy.sidebar.title'],
      title: source['privacy.sidebar.card.title'],
      description: source['privacy.sidebar.card.subtitle'],
    });
  },
);

it.each(cases)(
  'uses explicit site/contact bindings and keeps calls independent for $locale',
  ({ locale, source }) => {
    const otherBindings: PrivacyPolicyBindings = {
      siteHost: 'shop.second.example',
      email: 'second+privacy@example.test',
      phoneDisplay: '(050) 987-65-43',
      phoneHref: 'tel:+380509876543',
    };
    const dictionary = getPrivacyDictionary(locale, bindings);
    const otherDictionary = getPrivacyDictionary(locale, otherBindings);
    const output = flatten(dictionary.sections).join('\n');
    const otherOutput = flatten(otherDictionary.sections).join('\n');
    const contactInlines = dictionary.sections
      .find((section) => section.id === 'privacy-contact')
      ?.blocks.flatMap((block) =>
        block.kind === 'paragraph' ? block.content : block.items.flatMap((item) => item.content),
      );

    expect(dictionary.contact).toEqual({
      email: bindings.email,
      phoneDisplay: bindings.phoneDisplay,
      phoneHref: bindings.phoneHref,
    });
    expect(contactInlines?.filter((inline) => inline.href)).toEqual([
      { text: bindings.email, href: `mailto:${bindings.email}` },
      { text: bindings.phoneDisplay, href: bindings.phoneHref },
    ]);
    for (const value of [bindings.siteHost, bindings.email, bindings.phoneDisplay]) {
      expect(output).toContain(value);
      expect(otherOutput).not.toContain(value);
    }
    for (const value of [otherBindings.siteHost, otherBindings.email, otherBindings.phoneDisplay]) {
      expect(otherOutput).toContain(value);
      expect(output).not.toContain(value);
    }
    expect(output).not.toContain('kedr-web.vercel.app');
    expect(output).not.toContain('kedr.class19@gmail.com');
    expect(output).not.toContain('(068) 713-50-49');
    expect(source['privacy.section1.p1']).toContain('kedr-web.vercel.app');
    expect(source['privacy.section8.p1']).toContain('{email}');
    expect(source['privacy.section8.p1']).toContain('{phone}');
    expect(output).not.toContain('{email}');
    expect(output).not.toContain('{phone}');
  },
);
