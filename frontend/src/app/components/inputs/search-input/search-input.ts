import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
  styles: ``,
})
export class SearchInput {
  @Input() placeholder: string = '';
  @Output() onInputEvent = new EventEmitter<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onInputEvent.emit(value);
  }
}
