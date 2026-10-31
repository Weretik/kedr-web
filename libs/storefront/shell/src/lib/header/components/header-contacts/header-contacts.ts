import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'lib-header-contacts',
  imports: [CommonModule, ButtonModule, Popover, TranslocoPipe],
  templateUrl: './header-contacts.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header-contacts.css',
})
export class HeaderContactsComponent {
  @Input() mobile = false;
  @Output() copyPhone = new EventEmitter<void>();

  onCopyPhone(): void {
    this.copyPhone.emit();
  }
}
