import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface UiSelectOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.css',
})
export class UiSelectComponent {
  @Input() options: readonly UiSelectOption[] = [];
  @Input() value = '';
  @Input() placeholder = 'Seleccionar';
  @Input() ariaLabel = 'Selector';

  @Output() valueChanged = new EventEmitter<string>();

  protected isOpen = false;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  protected closeFromOutside(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  protected selectedLabel(): string {
    return this.options.find((option) => option.id === this.value)?.label ?? this.placeholder;
  }

  protected toggle(): void {
    this.isOpen = !this.isOpen;
  }

  protected choose(option: UiSelectOption): void {
    if (option.disabled) {
      return;
    }

    this.valueChanged.emit(option.id);
    this.isOpen = false;
  }

  protected onButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isOpen = true;
    }

    if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }
}
