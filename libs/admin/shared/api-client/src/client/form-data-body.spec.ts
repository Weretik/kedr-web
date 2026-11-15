import { describe, expect, it } from 'vitest';

import { formDataBody } from './form-data-body';

describe('formDataBody', () => {
  it('sends the file and the filled fields as form data', () => {
    const file = new Blob(['x'], { type: 'image/png' });
    const { body, bodySerializer } = formDataBody({
      file,
      folderId: 7,
      note: undefined,
      tag: null,
    });

    const form = bodySerializer(body);

    expect(form.get('file')).toBeInstanceOf(Blob);
    expect(form.get('folderId')).toBe('7');
    expect(form.has('note')).toBe(false);
    expect(form.has('tag')).toBe(false);
  });
});
