import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BadgeModule } from 'primeng/badge';

type CabinetSidebarItem = {
  labelKey: string;
  icon: string;
  route?: string;
};

type CabinetSidebarGroup = {
  labelKey: string;
  expanded: boolean;
  items: CabinetSidebarItem[];
};

@Component({
  selector: 'lib-cabinet-sidebar',
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    BadgeModule,
    TranslocoPipe,
  ],
  templateUrl: './cabinet-sidebar.html',
  styleUrl: './cabinet-sidebar.css',
})
export class CabinetSidebar {
  readonly groups: CabinetSidebarGroup[] = [
    {
      labelKey: 'cabinet.sidebar.group.main',
      expanded: true,
      items: [
        {
          labelKey: 'cabinet.sidebar.item.dashboard',
          icon: 'pi-home',
          route: 'dashboard',
        },
        { labelKey: 'cabinet.sidebar.item.profile', icon: 'pi-user-edit' },
        {
          labelKey: 'cabinet.sidebar.item.companyDetails',
          icon: 'pi-building',
        },
      ],
    },
    {
      labelKey: 'cabinet.sidebar.group.orders',
      expanded: true,
      items: [
        {
          labelKey: 'cabinet.sidebar.item.orderHistory',
          icon: 'pi-shopping-bag',
        },
        { labelKey: 'cabinet.sidebar.item.quickOrder', icon: 'pi-bolt' },
        { labelKey: 'cabinet.sidebar.item.excelUpload', icon: 'pi-file-excel' },
        {
          labelKey: 'cabinet.sidebar.item.draftCarts',
          icon: 'pi-shopping-cart',
        },
      ],
    },
    {
      labelKey: 'cabinet.sidebar.group.commerce',
      expanded: false,
      items: [
        { labelKey: 'cabinet.sidebar.item.personalPrices', icon: 'pi-tag' },
        { labelKey: 'cabinet.sidebar.item.commercialOffer', icon: 'pi-file' },
        { labelKey: 'cabinet.sidebar.item.documents', icon: 'pi-folder' },
        { labelKey: 'cabinet.sidebar.item.integration1c', icon: 'pi-refresh' },
      ],
    },
    {
      labelKey: 'cabinet.sidebar.group.customer',
      expanded: false,
      items: [
        { labelKey: 'cabinet.sidebar.item.favorites', icon: 'pi-heart' },
        { labelKey: 'cabinet.sidebar.item.compare', icon: 'pi-sort-alt' },
        {
          labelKey: 'cabinet.sidebar.item.claimsReturns',
          icon: 'pi-exclamation-circle',
        },
        { labelKey: 'cabinet.sidebar.item.notifications', icon: 'pi-bell' },
        { labelKey: 'cabinet.sidebar.item.manager', icon: 'pi-phone' },
      ],
    },
  ];

  toggleGroup(group: CabinetSidebarGroup): void {
    group.expanded = !group.expanded;
  }
}
