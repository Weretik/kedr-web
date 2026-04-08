import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lib-company-overview',
  imports: [TranslocoPipe],
  templateUrl: './company-overview.html',
  styleUrl: './company-overview.css',
})
export class CompanyOverview {}
