import { Component } from '@angular/core';

import { WholesaleHero } from '../sections/wholesale-hero/wholesale-hero';

@Component({
  selector: 'lib-wholesale-page',
  imports: [WholesaleHero],
  templateUrl: './wholesale-page.html',
  styleUrl: './wholesale-page.css',
})
export class WholesalePage {}
