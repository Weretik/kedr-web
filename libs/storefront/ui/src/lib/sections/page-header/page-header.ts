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
      class: 'px-0 !overflow-x-visible',
      style: {
        '--p-breadcrumb-background': this.themeService.isDark()
          ? 'var(--p-surface-900)'
          : 'var(--p-neutral-0)',
      },
    },
    list: {
      class: 'pl-0 ml-0 flex !flex-wrap items-center gap-y-1',
    },
    itemLabel: {
      class:
        'inline-block max-w-[8rem] sm:max-w-[12rem] md:max-w-[18rem] lg:max-w-[25rem] xl:max-w-[30rem] truncate align-bottom',
    },
  }));
}
