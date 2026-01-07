import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'lib-page-header',
  imports: [Breadcrumb, IconField, InputIcon, InputText],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  config = input.required<PageHeaderConfig>();

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
