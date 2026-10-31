import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-wholesale-hero',
  imports: [ButtonDirective, ButtonLabel, TranslocoPipe],
  templateUrl: './wholesale-hero.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './wholesale-hero.css',
})
export class WholesaleHero {}
