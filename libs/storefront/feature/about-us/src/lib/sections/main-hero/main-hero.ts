import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.css',
})
export class MainHero {
  readonly router = inject(Router);

  public goToCatalog() {
    this.router.navigate(['/catalog', 'products']);
  }

  public goToWholesale() {
    this.router.navigate(['/wholesale']);
  }
}
