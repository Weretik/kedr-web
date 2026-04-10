import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective, TranslocoPipe],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.css',
})
export class MainHero {
  readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);

  public goToCatalog() {
    this.router.navigate(
      this.localeNavigation.localizedSegments('catalog', 'products'),
    );
  }

  public goToWholesale() {
    this.router.navigate(this.localeNavigation.localizedSegments('wholesale'));
  }
}
