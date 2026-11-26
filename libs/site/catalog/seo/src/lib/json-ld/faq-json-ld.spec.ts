import { buildFaqPageJsonLd } from './faq-json-ld';

describe('buildFaqPageJsonLd', () => {
  it('lists the visible questions with their answers', () => {
    expect(
      buildFaqPageJsonLd([{ question: ' Як обрати завісу? ', answer: 'За вагою дверей.' }]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Як обрати завісу?',
          acceptedAnswer: { '@type': 'Answer', text: 'За вагою дверей.' },
        },
      ],
    });
  });

  it('gives no markup without a complete question', () => {
    expect(buildFaqPageJsonLd([])).toBeNull();
    expect(buildFaqPageJsonLd([{ question: 'Питання', answer: ' ' }])).toBeNull();
  });
});
