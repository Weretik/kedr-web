import type { ListingFilter } from '@site/catalog/model';

/**
 * Attribute filters of a final category inside the filter form: one group per attribute, one checkbox per value
 * with the number of models it gives. Values of one attribute widen the list, different attributes narrow it.
 * Checkboxes share the attribute slug as their name, so the GET form gives `?kolir=khrom&kolir=bronza`.
 */
export function AttributeFilters({ filters }: { filters: readonly ListingFilter[] }) {
  return filters.map((filter) => (
    <div key={filter.slug} className="border-t border-border pt-4">
      <fieldset className="grid gap-2.5">
        <legend className="mb-3 font-semibold">{filter.name}</legend>
        {filter.values.map((value) => (
          <label key={value.slug} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name={filter.slug}
              value={value.slug}
              defaultChecked={value.selected}
              className="size-4 accent-[var(--brand)]"
            />
            {filter.display === 'swatch' && (value.hex || value.textureUrl) && (
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-full border border-black/15 bg-cover bg-center"
                style={{
                  backgroundColor: value.hex ?? undefined,
                  backgroundImage: value.textureUrl ? `url(${value.textureUrl})` : undefined,
                }}
              />
            )}
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{value.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{value.count}</span>
          </label>
        ))}
      </fieldset>
    </div>
  ));
}
