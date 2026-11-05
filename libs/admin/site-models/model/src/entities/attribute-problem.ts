/** Why a product's attributes need review: a stable reason code and the recognizer's explanation. */
export interface AttributeProblem {
  code: string;
  text: string | null;
}

/** Ukrainian names of the reason codes the recognizer and the group build write. */
const reasonLabels: Record<string, string> = {
  ambiguous_side: 'Неоднозначна сторона',
  brand_marking_conflict: 'Бренд і No name разом',
  dimension_axes_unconfirmed: 'Не підтверджено розміри',
  invalid_dimension_unit: 'Неправильна одиниця розміру',
  multiple_size_expressions: 'Кілька розмірів у назві',
  multiple_unassigned_colors: 'Кілька кольорів без ролі',
  no_name: 'No name',
  packaging_alternatives: 'Кілька варіантів пакування',
  same_variants: 'Однакові варіанти',
  section_axes_unconfirmed: 'Не підтверджено розміри профілю',
  single_dimension_role_unconfirmed: 'Не підтверджено, що означає розмір',
  unresolved_accessory_function_code: 'Не розшифровано функцію',
  unresolved_bearing_designation: 'Не розшифровано підшипник',
  unresolved_color: 'Не розшифровано колір',
  unresolved_color_alias_expression: 'Не розшифровано запис кольору',
  unresolved_color_combination: 'Не розшифровано поєднання кольорів',
  unresolved_cylinder_configuration_code: 'Не розшифровано схему циліндра',
  unresolved_cylinder_turn_marker: 'Не розшифровано поворотник',
  unresolved_function_code: 'Не розшифровано код функції',
  unresolved_material_code: 'Не розшифровано матеріал',
  unresolved_position_marker: 'Не розшифровано положення',
  unresolved_product_type: 'Не визначено тип товару',
  unresolved_series_marker: 'Не розшифровано серію',
  unresolved_side: 'Не визначено сторону',
  unresolved_smart_variant_code: 'Не розшифровано смарт-варіант',
  unresolved_unassigned_finish: 'Не визначено покриття',
  unresolved_unresolved_marker: 'Не розшифровано позначку',
  unresolved_unresolved_size_code: 'Не розшифровано код розміру',
  unresolved_wood_species_or_decor: 'Не розшифровано породу чи декор',
  viewer_range_unconfirmed: 'Не підтверджено діапазон вічка',
  wing_dimensions_unconfirmed: 'Не підтверджено розміри стулки',
};

/** The reason name for filters; an unknown code is shown as it is. */
export function problemReasonLabel(code: string): string {
  return reasonLabels[code] ?? `Потребує перевірки (${code})`;
}

/**
 * A short label for a table cell: the reason and, when the explanation starts with a quoted code, that code,
 * for example «Не розшифровано матеріал: AL».
 */
export function problemLabel(problem: AttributeProblem): string {
  const code = /^«([^»]{1,40})»/.exec(problem.text ?? '')?.[1];
  const label = problemReasonLabel(problem.code);
  return code ? `${label}: ${code}` : label;
}
