import {Input, Directive, WritableSignal, Output, EventEmitter} from '@angular/core';
import {ComponentBase} from '../component-base';
import {Observable} from 'rxjs';

@Directive()
export abstract class ButtonBase
    extends ComponentBase {
  @Input() text: string = '';
  @Input() loading$: Observable<boolean> | undefined;
  @Input() disabled$: Observable<boolean> | undefined;
  @Output() onClickEvent = new EventEmitter<void>();

  onClick() {
    this.onClickEvent.emit();
  }
}
