import type { CategoryDetails } from '@site/catalog/model';

// A name that already starts with a word of the parent («Ручки на розетці» under «Ручки») keeps its subject.
const STEM_LENGTH = 4;

const stem = (word: string) => word.toLocaleLowerCase('uk').slice(0, STEM_LENGTH);

// «Врізні» reads as «Завіси врізні»; a Latin brand («Apecs») or an abbreviation keeps its capital letter.
// A one-letter word («З нержавійки») is a preposition, so it is lowered too.
const continueAfterParent = (name: string) =>
  /^[А-ЯЁІЇЄҐ]([а-яёіїєґ'’]|\s)/u.test(name)
    ? name[0].toLocaleLowerCase('uk') + name.slice(1)
    : name;

/**
 * The category name a search result can stand on: a subcategory that names only its kind («Врізні»,
 * «З нержавійки») gets its parent's name first («Завіси врізні», «Ручки з нержавійки»). Top sections and
 * names that already carry the parent's word stay as they are.
 */
export function categorySubject(category: Pick<CategoryDetails, 'id' | 'name' | 'breadcrumbs'>) {
  const ancestors = category.breadcrumbs.filter((crumb) => crumb.id !== category.id);
  const parent = ancestors[ancestors.length - 1];
  if (!parent) return category.name;

  const parentWord = parent.name.split(/\s+/)[0] ?? '';
  const nameWords = category.name.split(/[\s-]+/).map(stem);
  if (parentWord.length < STEM_LENGTH || nameWords.includes(stem(parentWord))) return category.name;

  return `${parent.name} ${continueAfterParent(category.name)}`;
}
