import {OnInit, Input, Directive, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ComponentBase} from '../component-base';

@Directive()
export abstract class CheckBase
    extends ComponentBase
    implements OnInit {
  @Input() text: string = '';
  @Input() controlName: string = '';
  @Input() parentForm!: FormGroup;
  @Output() clickEvent = new EventEmitter<boolean>();

  control!: FormControl;

  ngOnInit(): void {
    this.control = this.parentForm.get(this.controlName) as FormControl;
  }

  onClickEvent(event: Event): void {
    const val = (event.target as HTMLInputElement).checked
    this.clickEvent.emit(val);
  }
}
