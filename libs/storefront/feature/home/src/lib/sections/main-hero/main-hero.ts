import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective, NgOptimizedImage],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.css',
})
export class MainHero {}
