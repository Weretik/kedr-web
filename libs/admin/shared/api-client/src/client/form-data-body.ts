type FormValue = Blob | string | number | boolean | null | undefined;

const toFormData = (fields: unknown): FormData => {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields as Record<string, FormValue>)) {
    if (value === undefined || value === null) continue;
    form.append(name, value instanceof Blob ? value : String(value));
  }

  return form;
};

/**
 * Upload fields of a `multipart/form-data` operation. The contract types a file (`format: binary`) as a string, so the
 * body is typed by the call and the fields go out as `FormData`.
 */
export const formDataBody = (fields: Record<string, FormValue>) => ({
  body: fields as never,
  bodySerializer: toFormData,
});
