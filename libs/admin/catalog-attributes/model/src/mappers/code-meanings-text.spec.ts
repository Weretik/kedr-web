import { describe, expect, it } from 'vitest';

import { codeMeaningsText } from './code-meanings-text';

import type { CodeMeaning } from '../entities/unresolved-code';

describe('codeMeaningsText', () => {
  it('joins «ознака: значення» pairs', () => {
    const meanings = [
      { attributeName: 'Колір', valueName: 'Золото' },
      { attributeName: 'Конфігурація', valueName: 'Z' },
    ] as CodeMeaning[];
    expect(codeMeaningsText(meanings)).toBe('Колір: Золото · Конфігурація: Z');
  });
});
