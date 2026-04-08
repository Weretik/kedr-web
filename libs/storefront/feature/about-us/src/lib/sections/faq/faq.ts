import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'primeng/accordion';

type FaqTab = {
  value: number;
  title: string;
  content: string;
};

@Component({
  selector: 'lib-faq',
  standalone: true,
  imports: [AccordionModule, CommonModule, TranslocoPipe],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  private readonly translocoService = inject(TranslocoService);
  private readonly activeLanguage = toSignal(
    this.translocoService.langChanges$,
    {
      initialValue: this.translocoService.getActiveLang(),
    },
  );

  readonly tabs = computed<FaqTab[]>(() => {
    this.activeLanguage();
    return [
      {
        value: 0,
        title: this.translocoService.translate('about.faq.q1.title'),
        content: this.translocoService.translate('about.faq.q1.content'),
      },
      {
        value: 1,
        title: this.translocoService.translate('about.faq.q2.title'),
        content: this.translocoService.translate('about.faq.q2.content'),
      },
      {
        value: 2,
        title: this.translocoService.translate('about.faq.q3.title'),
        content: this.translocoService.translate('about.faq.q3.content'),
      },
      {
        value: 3,
        title: this.translocoService.translate('about.faq.q4.title'),
        content: this.translocoService.translate('about.faq.q4.content'),
      },
      {
        value: 4,
        title: this.translocoService.translate('about.faq.q5.title'),
        content: this.translocoService.translate('about.faq.q5.content'),
      },
      {
        value: 5,
        title: this.translocoService.translate('about.faq.q6.title'),
        content: this.translocoService.translate('about.faq.q6.content'),
      },
    ];
  });
}
