import { SlugEditForm } from './slug-edit-form';
import { SectionCard } from '../layout/section-card';

import type { SlugEditFormProps } from './slug-edit-form';

export type { ChangeSlugInput } from './slug-edit-form';

/** «Адреса на сайті» in an edit panel; the old address keeps redirecting to the new one. */
export function SlugEditCard(props: SlugEditFormProps) {
  return (
    <SectionCard title="Адреса на сайті">
      <SlugEditForm {...props} />
    </SectionCard>
  );
}
