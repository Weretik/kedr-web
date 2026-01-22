import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@shared/ui';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'lib-page-header',
  imports: [Breadcrumb, IconField, InputIcon, InputText, FormsModule],
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

  public searchValue = input<string>('');
  public searchValueChange = output<string>();

  onSearchInput(inputValue: string) {
    this.searchValueChange.emit(inputValue);
  }
}
