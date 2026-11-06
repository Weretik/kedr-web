/** A value of an attribute filter with the number of models the list shows when it is added. */
export type ListingFilterValue = {
  slug: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
  count: number;
  selected: boolean;
};

/** An attribute filter of a final category («Фільтри категорій» in the admin), in display order. */
export type ListingFilter = {
  slug: string;
  name: string;
  display: 'swatch' | 'button' | 'checkbox';
  values: ListingFilterValue[];
};

/** Where an exact 1C code search leads: a model page with the product's axis values chosen. */
export type ListingExactMatch = {
  slug: string;
  selection: Record<string, string>;
};
