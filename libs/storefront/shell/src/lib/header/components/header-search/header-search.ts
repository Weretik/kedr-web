import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
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
  imports: [CommonModule, ButtonModule, Popover, TranslocoPipe],
  templateUrl: './header-search.html',
  styleUrl: './header-search.css',
})
export class HeaderSearchComponent {
  private readonly hostElement = inject(ElementRef<HTMLElement>);

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

  @ViewChild('desktopSearchHistoryPopover')
  private desktopPopover?: Popover;

  @ViewChild('mobileSearchHistoryPopover')
  private mobilePopover?: Popover;

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

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const clickedInsideSearch = this.hostElement.nativeElement.contains(target);
    const clickedInsidePopover = !!target.closest('.p-popover');

    if (clickedInsideSearch || clickedInsidePopover) {
      return;
    }

    this.desktopPopover?.hide();
    this.mobilePopover?.hide();
  }
}
