import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ContactUs } from '../sections/contact-us/contact-us';

@Component({
  selector: 'lib-contacts-page',
  imports: [PageHeader, ContactUs],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.css',
})
export class ContactsPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('contacts.page.title'),
      breadcrumbs: [
        { label: this.transloco.translate('contacts.page.breadcrumb.about') },
        { label: this.transloco.translate('contacts.page.breadcrumb.current') },
      ],
      showSearch: false,
    };
  });
}
