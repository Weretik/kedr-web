import { Component } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-wholesale-hero',
  imports: [ButtonDirective, ButtonLabel],
  templateUrl: './wholesale-hero.html',
  styleUrl: './wholesale-hero.css',
})
export class WholesaleHero {}
