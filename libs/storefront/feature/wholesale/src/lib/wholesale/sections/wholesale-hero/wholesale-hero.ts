import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-wholesale-hero',
  imports: [ButtonDirective, ButtonLabel, TranslocoPipe],
  templateUrl: './wholesale-hero.html',
  styleUrl: './wholesale-hero.css',
})
export class WholesaleHero {}
