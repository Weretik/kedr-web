import { homeBrandIssues, homeFaqIssues, moveHomeItem } from './home-rules';

describe('home content rules', () => {
  it('requires the question and answer in both languages within the limits', () => {
    expect(
      homeFaqIssues({ questionUk: 'Так?', questionRu: 'Да?', answerUk: 'Так.', answerRu: 'Да.' }),
    ).toEqual({});
    expect(
      homeFaqIssues({
        questionUk: ' ',
        questionRu: 'а'.repeat(201),
        answerUk: 'Так.',
        answerRu: 'б'.repeat(2001),
      }),
    ).toEqual({
      questionUk: 'Заповніть поле.',
      questionRu: 'Не більше 200 символів.',
      answerRu: 'Не більше 2000 символів.',
    });
  });

  it('requires a brand name and a logo', () => {
    expect(homeBrandIssues({ name: '', logo: null })).toEqual({
      name: 'Заповніть поле.',
      logo: 'Виберіть логотип.',
    });
    expect(
      homeBrandIssues({ name: 'Apecs', logo: { mediaFileId: 7, url: null, fileName: null } }),
    ).toEqual({});
  });

  it('moves one entry and keeps the others in order', () => {
    expect(moveHomeItem([1, 2, 3, 4], 3, 0)).toEqual([3, 1, 2, 4]);
    expect(moveHomeItem([1, 2, 3], 1, 9)).toEqual([2, 3, 1]);
    expect(moveHomeItem([1, 2, 3], 2, 1)).toEqual([1, 2, 3]);
  });
});
