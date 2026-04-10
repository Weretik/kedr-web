import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-hero',
  imports: [ButtonDirective, ButtonLabel, TranslocoPipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Input() locationText = '';
}
