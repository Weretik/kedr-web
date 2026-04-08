import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'lib-header-contacts',
  imports: [CommonModule, ButtonModule, Popover, TranslocoPipe],
  templateUrl: './header-contacts.html',
  styleUrl: './header-contacts.css',
})
export class HeaderContactsComponent {
  @Input() mobile = false;
  @Output() copyPhone = new EventEmitter<void>();

  onCopyPhone(): void {
    this.copyPhone.emit();
  }
}
