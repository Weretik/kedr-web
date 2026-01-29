import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

type ThemeValue = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorageService);

  private readonly DARK_CLASS = 'my-app-dark';
  private readonly THEME_KEY = 'theme';

  private readonly _theme = signal<ThemeValue>(this.readInitialTheme());
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  private InitTheme = effect(() => {
    this.document.documentElement.classList.toggle(
      this.DARK_CLASS,
      this.isDark(),
    );
  });
  private saveInStorage = effect(() => {
    this.storage.setItem(this.THEME_KEY, this._theme());
  });

  setTheme(isDark: boolean): void {
    this._theme.set(isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private readInitialTheme(): ThemeValue {
    const saved = this.storage.getItem(this.THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  }
}
