import { Component, computed, inject, input } from '@angular/core';
import { ThemeService } from '@shared/ui';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'lib-page-header',
  imports: [Breadcrumb],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  public themeService = inject(ThemeService);
  public config = input.required<PageHeaderConfig>();

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  public readonly breadcrumbPt = computed(() => ({
    root: {
      style: {
        paddingLeft: '0',
        paddingRight: '0',
        '--p-breadcrumb-background': this.themeService.isDark()
          ? 'var(--p-surface-900)'
          : 'var(--p-neutral-0)',
      },
    },
    list: {
      style: {
        paddingLeft: '0',
        marginLeft: '0',
      },
    },
  }));
}
