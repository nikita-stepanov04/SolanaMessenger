import {Component, Input} from '@angular/core';
import { InputBase} from '../input-base';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {stringFormat} from '../../../helpers/format';
import {TrimInputDirective} from '../trim-input-directive';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    TrimInputDirective,
  ],
  templateUrl: './text-input.html',
  styles: ``,
})
export class TextInput extends InputBase {
  @Input() minLength: number = 5;
  @Input() maxLength: number = 30;

  minLengthValidation: string;
  maxLengthValidation: string;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.minLengthValidation = stringFormat(await this.resources.getAsync('str017'), this.minLength);
    this.maxLengthValidation = stringFormat(await this.resources.getAsync('str018'), this.maxLength);
  }
}
