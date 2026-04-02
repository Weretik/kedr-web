import { Injectable, computed, inject, signal } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly storage = inject(BrowserStorageService);

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
    this.write([]);
  }

  private normalize(value: string): string {
    return (value ?? '').trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  private read(): string[] {
    try {
      const raw = this.storage.getItem(this.storageKey);
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
    try {
      if (items.length === 0) {
        this.storage.removeItem(this.storageKey);
        return;
      }

      this.storage.setItem(this.storageKey, JSON.stringify(items));
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
    this.write(next);
  }
}
