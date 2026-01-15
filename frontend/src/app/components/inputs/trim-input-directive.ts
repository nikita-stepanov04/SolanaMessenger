import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[trimInput]'
})
export class TrimInputDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const value = input.value;
      const noLeading = value.replace(/^\s+/, '');
      if (noLeading !== value) {
        this.ngControl.control?.setValue(noLeading, { emitEvent: false });
        input.value = noLeading;
      }
    }
  }

  @HostListener('blur')
  onBlur() {
    const control = this.ngControl.control;
    if (control && typeof control.value === 'string') {
      const trimmed = control.value.replace(/\s+$/, '');
      control.setValue(trimmed);
    }
  }
}
