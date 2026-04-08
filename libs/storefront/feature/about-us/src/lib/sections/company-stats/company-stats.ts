import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

interface CompanyStat {
  icon: string;
  value: string;
  title: string;
  description: string;
}

@Component({
  selector: 'lib-company-stats',
  imports: [NgClass],
  templateUrl: './company-stats.html',
  styleUrl: './company-stats.css',
})
export class CompanyStats {
  private readonly translocoService = inject(TranslocoService);
  private readonly activeLanguage = toSignal(
    this.translocoService.langChanges$,
    {
      initialValue: this.translocoService.getActiveLang(),
    },
  );

  readonly sectionTitle = computed(() => {
    this.activeLanguage();
    return this.translocoService.translate('about.stats.heading');
  });

  readonly sectionDescription = computed(() => {
    this.activeLanguage();
    return this.translocoService.translate('about.stats.subheading');
  });

  readonly stats = computed<CompanyStat[]>(() => {
    this.activeLanguage();
    return [
      {
        icon: 'pi pi-calendar',
        value: '15+',
        title: this.translocoService.translate('about.stats.item1.title'),
        description: this.translocoService.translate('about.stats.item1.text'),
      },
      {
        icon: 'pi pi-box',
        value: '15 000+',
        title: this.translocoService.translate('about.stats.item2.title'),
        description: this.translocoService.translate('about.stats.item2.text'),
      },
      {
        icon: 'pi pi-users',
        value: '50 000+',
        title: this.translocoService.translate('about.stats.item3.title'),
        description: this.translocoService.translate('about.stats.item3.text'),
      },
      {
        icon: 'pi pi-truck',
        value: '1 000+',
        title: this.translocoService.translate('about.stats.item4.title'),
        description: this.translocoService.translate('about.stats.item4.text'),
      },
    ];
  });
}
