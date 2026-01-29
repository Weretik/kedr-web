import { MenuItem } from 'primeng/api';

export interface PageHeaderConfig {
  title: string;
  breadcrumbs: MenuItem[];
  showSearch?: boolean;
  hideTitle?: boolean;
}
