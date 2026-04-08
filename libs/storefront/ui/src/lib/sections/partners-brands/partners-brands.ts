import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lib-partners-brands',
  imports: [NgOptimizedImage, TranslocoPipe],
  templateUrl: './partners-brands.html',
  styleUrl: './partners-brands.css',
})
export class PartnersBrands {}
