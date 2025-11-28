import {OnInit, Input, Directive} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ComponentBase} from '../component-base';

@Directive()
export abstract class InputBase
    extends ComponentBase
    implements OnInit {
  @Input() label: string = '';
  @Input() controlName: string = '';
  @Input() parentForm!: FormGroup;

  control!: FormControl;

  ngOnInit(): void {
    this.control = this.parentForm.get(this.controlName) as FormControl;
  }
}
