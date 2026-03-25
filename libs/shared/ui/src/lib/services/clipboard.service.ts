import { inject, Injectable } from '@angular/core';

import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly notification = inject(NotificationService);

  async copy(value: string, successMessage = 'Скопійовано'): Promise<boolean> {
    const text = value?.trim();
    if (!text) {
      return false;
    }

    try {
      const clipboard = globalThis.navigator?.clipboard;
      if (clipboard?.writeText) {
        await clipboard.writeText(text);
      } else if (!this.copyUsingExecCommand(text)) {
        throw new Error('Clipboard is unavailable');
      }

      this.notification.success(successMessage);
      return true;
    } catch {
      this.notification.warn('Не вдалося скопіювати');
      return false;
    }
  }

  private copyUsingExecCommand(value: string): boolean {
    const doc = globalThis.document;
    if (!doc) {
      return false;
    }

    const textarea = doc.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';

    doc.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = doc.execCommand('copy');
    doc.body.removeChild(textarea);
    return copied;
  }
}
