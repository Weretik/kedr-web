import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storageKey = 'kedr.search.history.v1';
  private readonly maxItems = 10;

  private readonly _items = signal<string[]>(this.read());
  readonly items = computed(() => this._items());

  add(raw: string): void {
    const value = this.normalize(raw);
    if (!value) return;

    const next = [
      value,
      ...this._items().filter((x) => x.toLowerCase() !== value.toLowerCase()),
    ].slice(0, this.maxItems);

    this._items.set(next);
    this.write(next);
  }

  clear(): void {
    this._items.set([]);
    this.remove();
  }

  suggest(query: string): string[] {
    const q = this.normalize(query).toLowerCase();
    if (!q) return this._items();

    return this._items().filter((x) => x.toLowerCase().includes(q));
  }

  private normalize(value: string): string {
    return (value ?? '').trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  private read(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((x) => typeof x === 'string')
        : [];
    } catch {
      return [];
    }
  }

  private write(items: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  private remove(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      sessionStorage.removeItem(this.storageKey);
    } catch {
      // ignore
    }
  }

  removeOne(raw: string): void {
    const value = this.normalize(raw);
    if (!value) return;

    const next = this._items().filter(
      (x) => x.toLowerCase() !== value.toLowerCase(),
    );

    if (next.length === this._items().length) return;

    this._items.set(next);

    if (next.length === 0) {
      this.remove();
      return;
    }

    this.write(next);
  }
}
