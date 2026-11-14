import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { useState } from 'react';

/** Something to pick by name: an attribute or a value. */
export interface PickerOption {
  id: number;
  name: string;
}

/** A typed name nothing matches yet: picking it creates it. */
interface NewOption {
  id: null;
  name: string;
}

type Choice = PickerOption | NewOption;

const filter = createFilterOptions<Choice>({ stringify: (option) => option.name });

interface CreatablePickerProps {
  options: readonly PickerOption[];
  /** The picked option, or `null`. */
  value: number | null;
  /** Shown when nothing is picked, for example «—». */
  emptyText?: string;
  label?: string;
  ariaLabel: string;
  /** «Створити ознаку» or «Створити значення». */
  createText: string;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  onPick: (id: number) => void;
  /** Creates an option with the typed name and returns its id, or `undefined` when it failed. */
  onCreate: (name: string) => Promise<number | undefined>;
  onBlur?: () => void;
}

/**
 * A searchable picker that offers «Створити …» for a typed name nothing matches, so a missing attribute or value is
 * added right where it is needed.
 */
export function CreatablePicker(props: CreatablePickerProps) {
  const [creating, setCreating] = useState(false);
  const selected = props.options.find((option) => option.id === props.value) ?? null;

  const create = async (name: string) => {
    setCreating(true);
    try {
      const id = await props.onCreate(name);
      if (id !== undefined) props.onPick(id);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Autocomplete<Choice, false, false, false>
      autoHighlight
      disabled={props.disabled || creating}
      filterOptions={(options, state) => {
        const filtered = filter(options, state);
        const typed = state.inputValue.trim();
        const exists = options.some(
          (option) => option.name.toLocaleLowerCase('uk') === typed.toLocaleLowerCase('uk'),
        );
        return typed && !exists ? [...filtered, { id: null, name: typed }] : filtered;
      }}
      fullWidth
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText="Почніть вводити назву"
      onBlur={props.onBlur}
      onChange={(_event, option) => {
        if (!option) return;
        if (option.id === null) void create(option.name);
        else props.onPick(option.id);
      }}
      openOnFocus
      options={[...props.options]}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={props.autoFocus}
          error={props.error}
          label={props.label}
          placeholder={props.emptyText}
          slotProps={{
            ...params.slotProps,
            htmlInput: { ...params.slotProps.htmlInput, 'aria-label': props.ariaLabel },
          }}
        />
      )}
      renderOption={(optionProps, option) => {
        const { key, ...rest } = optionProps;
        return (
          <li key={key} {...rest}>
            {option.id === null ? `+ ${props.createText} «${option.name}»` : option.name}
          </li>
        );
      }}
      size="small"
      value={selected}
    />
  );
}
