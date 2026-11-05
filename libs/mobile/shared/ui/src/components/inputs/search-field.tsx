import { TextField, type TextFieldProps } from './text-field';

export type SearchFieldProps = Omit<TextFieldProps, 'leadingIcon' | 'secret'>;

/** Text field with a search icon; search starts while typing. */
export function SearchField(props: Readonly<SearchFieldProps>) {
  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      returnKeyType="search"
      {...props}
      leadingIcon="magnify"
    />
  );
}
