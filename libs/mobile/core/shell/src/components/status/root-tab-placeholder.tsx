import { ShellState } from './shell-state';
import { AppScreen } from '../layout/app-screen';

export interface RootTabPlaceholderProps {
  description: string;
  title: string;
}

export function RootTabPlaceholder({ description, title }: Readonly<RootTabPlaceholderProps>) {
  return (
    <AppScreen edges={['top', 'left', 'right']}>
      <ShellState description={description} kind="empty" title={title} />
    </AppScreen>
  );
}
