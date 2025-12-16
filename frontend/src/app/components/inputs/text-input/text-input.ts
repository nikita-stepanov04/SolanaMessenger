import {Component, Input, OnInit} from '@angular/core';
import { InputBase} from '../input-base';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './text-input.html',
  styles: ``,
})
export class TextInput extends InputBase {
  @Input() minLength: number = 5;
  @Input() maxLength: number = 30;

  minLengthValidation: string;
  maxLengthValidation: string;

  protected format(str: string, ...args: any[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index]);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.minLengthValidation = this.format(await this.resources.getAsync('str017'), this.minLength);
    this.maxLengthValidation = this.format(await this.resources.getAsync('str018'), this.maxLength);
  }
}
