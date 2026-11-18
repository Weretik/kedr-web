import { type Components, type Theme } from '@mui/material/styles';

import { adminBaseComponents } from './baseline-and-feedback';
import { adminInputComponents } from './buttons-and-inputs';
import { adminNavigationComponents } from './navigation';
import { adminSurfaceComponents } from './surfaces';
import { adminTableComponents } from './tables';

/** Every MUI component override of the Admin theme, grouped by kind. */
export const adminComponents = {
  ...adminBaseComponents,
  ...adminInputComponents,
  ...adminSurfaceComponents,
  ...adminNavigationComponents,
  ...adminTableComponents,
} satisfies Components<Theme>;
