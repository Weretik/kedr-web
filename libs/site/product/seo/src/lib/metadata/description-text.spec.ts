import { descriptionFromText } from './description-text';

describe('descriptionFromText', () => {
  it('takes the first paragraph of a model text', () => {
    expect(descriptionFromText('\n  Завіса FLUSH для дверей.  \n\nДругий абзац.')).toBe(
      'Завіса FLUSH для дверей.',
    );
  });

  it('cuts a long paragraph at a word within 160 characters', () => {
    const text = `${'слово '.repeat(40)}кінець`;
    const result = descriptionFromText(text);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it('gives nothing for an empty text', () => {
    expect(descriptionFromText('  \n ')).toBe('');
  });
});
