import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective, TranslocoPipe],
  templateUrl: './main-hero.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-hero.css',
})
export class MainHero {
  readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);

  public goToCatalog() {
    this.router.navigate(this.localeNavigation.localizedSegments('catalog', 'products'));
  }

  public goToWholesale() {
    this.router.navigate(this.localeNavigation.localizedSegments('wholesale'));
  }
}
