import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

type HeaderLocale = 'uk' | 'ru';

@Component({
  selector: 'lib-header-actions',
  imports: [CommonModule, ButtonModule, OverlayBadgeModule, TranslocoPipe],
  templateUrl: './header-actions.html',
  styleUrl: './header-actions.css',
})
export class HeaderActionsComponent {
  @Input() currentLocale: HeaderLocale = 'uk';
  @Input() isDark = false;
  @Input() cartItemsCount = 0;

  @Output() localeChange = new EventEmitter<HeaderLocale>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();

  onLocaleChange(locale: HeaderLocale): void {
    this.localeChange.emit(locale);
  }

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  onOpenCart(): void {
    this.openCart.emit();
  }
}
