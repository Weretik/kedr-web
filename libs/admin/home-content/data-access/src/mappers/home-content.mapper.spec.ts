import { mapHomeBlocks, toHomeBrandBody, toHomeFaqBody } from './home-content.mapper';

describe('home content mapper', () => {
  it('groups the FAQ texts and keeps a brand whose logo is gone', () => {
    const blocks = mapHomeBlocks({
      faq: [
        {
          id: 1,
          position: 0,
          questionUk: 'Питання?',
          questionRu: 'Вопрос?',
          answerUk: 'Відповідь.',
          answerRu: 'Ответ.',
          updatedAt: '2026-11-04T00:00:00Z',
        },
      ],
      brands: [
        {
          id: 2,
          position: 0,
          name: 'Apecs',
          logoMediaFileId: 9,
          logoUrl: null,
          logoFileName: null,
          logoMissing: true,
          updatedAt: '2026-11-04T00:00:00Z',
        },
      ],
    });

    expect(blocks.faq[0].texts).toEqual({
      questionUk: 'Питання?',
      questionRu: 'Вопрос?',
      answerUk: 'Відповідь.',
      answerRu: 'Ответ.',
    });
    expect(blocks.brands[0]).toMatchObject({ name: 'Apecs', logoMissing: true, logoUrl: null });
    expect(() => mapHomeBlocks({ faq: [] })).toThrow();
  });

  it('trims what is sent', () => {
    expect(
      toHomeFaqBody({
        questionUk: ' Так? ',
        questionRu: 'Да?',
        answerUk: 'Так.',
        answerRu: ' Да. ',
      }),
    ).toEqual({ questionUk: 'Так?', questionRu: 'Да?', answerUk: 'Так.', answerRu: 'Да.' });
    expect(
      toHomeBrandBody({ name: ' Apecs ', logo: { mediaFileId: 7, url: null, fileName: null } }),
    ).toEqual({ name: 'Apecs', logoMediaFileId: 7 });
  });
});
