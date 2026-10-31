import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Footer, Header } from '@storefront/shell';
import { Toast } from 'primeng/toast';
import { filter, map, startWith } from 'rxjs';

import { SeoHreflangService } from './seo/seo-hreflang.service';

@Component({
  imports: [RouterModule, Toast, Footer, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  private readonly seoHreflangService = inject(SeoHreflangService);
  private readonly router = inject(Router);
  protected title = 'storefront';
  readonly isCabinetRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.includes('/cabinet')),
      startWith(this.router.url.includes('/cabinet')),
    ),
    { initialValue: false },
  );

  constructor() {
    void this.seoHreflangService;
  }
}
