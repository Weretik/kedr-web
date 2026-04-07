import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';

type SearchValuePayload = {
  value: string;
  popover: Popover;
};

type SearchDraftPayload = {
  value: string;
  popover: Popover;
  event: Event;
};

@Component({
  selector: 'lib-header-search',
  imports: [CommonModule, ButtonModule, Popover],
  templateUrl: './header-search.html',
  styleUrl: './header-search.css',
})
export class HeaderSearchComponent {
  @Input() draftSearch = '';
  @Input() historyItems: readonly string[] = [];
  @Input() mobile = false;

  @Output() searchRequest = new EventEmitter<SearchValuePayload>();
  @Output() draftSearchChange = new EventEmitter<SearchDraftPayload>();
  @Output() showHistory = new EventEmitter<{
    popover: Popover;
    event: Event;
  }>();
  @Output() useHistoryItem = new EventEmitter<SearchValuePayload>();
  @Output() removeHistoryItem = new EventEmitter<SearchValuePayload>();
  @Output() clearHistoryRequest = new EventEmitter<Popover>();

  onSearch(value: string, popover: Popover): void {
    this.searchRequest.emit({ value, popover });
  }

  onDraftChange(value: string, popover: Popover, event: Event): void {
    this.draftSearchChange.emit({ value, popover, event });
  }

  onShowHistory(popover: Popover, event: Event): void {
    this.showHistory.emit({ popover, event });
  }

  onUseHistoryItem(value: string, popover: Popover): void {
    this.useHistoryItem.emit({ value, popover });
  }

  onRemoveHistoryItem(value: string, popover: Popover): void {
    this.removeHistoryItem.emit({ value, popover });
  }

  onClearHistory(popover: Popover): void {
    this.clearHistoryRequest.emit(popover);
  }
}
