import { categorySubject } from './category-subject';

const category = (name: string, parents: string[]) => ({
  id: 100,
  name,
  breadcrumbs: parents.map((parent, index) => ({ id: index + 1, slug: `p${index}`, name: parent })),
});

describe('categorySubject', () => {
  it('keeps a top section as it is', () => {
    expect(categorySubject(category('Завіси', []))).toBe('Завіси');
  });

  it('puts the nearest parent before a subcategory that names only its kind', () => {
    expect(categorySubject(category('Врізні', ['Завіси']))).toBe('Завіси врізні');
    expect(categorySubject(category('З нержавійки', ['Ручки']))).toBe('Ручки з нержавійки');
    expect(categorySubject(category('Скрытые', ['Двери', 'Петли']))).toBe('Петли скрытые');
  });

  it('keeps a name that already carries the parent word', () => {
    expect(categorySubject(category('Ручки на розетці', ['Ручки']))).toBe('Ручки на розетці');
    expect(categorySubject(category('Дверні ручки-кноби', ['Ручки']))).toBe('Дверні ручки-кноби');
  });

  it('keeps the capital letter of a brand or an abbreviation', () => {
    expect(categorySubject(category('Apecs', ['Циліндри']))).toBe('Циліндри Apecs');
    expect(categorySubject(category('МДФ', ['Двері']))).toBe('Двері МДФ');
  });

  it('ignores the category itself if the API lists it among its crumbs', () => {
    const self = { id: 100, name: 'Врізні', breadcrumbs: [{ id: 100, slug: 'v', name: 'Врізні' }] };
    expect(categorySubject(self)).toBe('Врізні');
  });

  it('skips a catch-all parent such as «Інше» and takes the next real one', () => {
    expect(categorySubject(category('На розетці (R-08/R-10)', ['Ручки', 'Інше']))).toBe(
      'Ручки на розетці (R-08/R-10)',
    );
    expect(categorySubject(category('Товари, виведені з асортименту', ['Інше']))).toBe(
      'Товари, виведені з асортименту',
    );
    expect(categorySubject(category('Скрытые', ['Петли', 'Прочее']))).toBe('Петли скрытые');
  });

  it('names a catch-all category after its parent', () => {
    expect(categorySubject(category('Інше', ['Ручки']))).toBe('Ручки — інше');
    expect(categorySubject(category('Інше', []))).toBe('Інше');
  });
});
