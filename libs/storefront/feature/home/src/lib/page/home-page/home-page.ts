import { Component } from '@angular/core';

import { CompanyStats } from '../../sections/company-stats/company-stats';
import { Faq } from '../../sections/faq/faq';
import { MainHero } from '../../sections/main-hero/main-hero';
import { PartnersBrands } from '../../sections/partners-brands/partners-brands';

@Component({
  selector: 'lib-home-page',
  imports: [MainHero, PartnersBrands, CompanyStats, Faq],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
