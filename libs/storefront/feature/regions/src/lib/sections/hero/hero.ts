import { Component, Input } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-hero',
  imports: [ButtonDirective, ButtonLabel],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Input() locationText = 'в Україні';
}
