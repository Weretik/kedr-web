import { AppScreen } from '../layout/app-screen';
import { ShellState } from './shell-state';

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
