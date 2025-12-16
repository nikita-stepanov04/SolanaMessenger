import {Input, Directive, WritableSignal} from '@angular/core';
import {ComponentBase} from '../component-base';

@Directive()
export abstract class ButtonBase
    extends ComponentBase {
  @Input() text: string = '';
  @Input() disabled = false;
  @Input() loading$: WritableSignal<boolean>;
}
