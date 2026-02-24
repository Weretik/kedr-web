import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartUiFacade {
  readonly isOpen = signal(false);

  public open() {
    this.isOpen.set(true);
  }
  public close() {
    this.isOpen.set(false);
  }
  public toggle() {
    this.isOpen.update((value) => !value);
  }
}
