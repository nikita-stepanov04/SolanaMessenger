import {AfterViewChecked, Component, ElementRef, Input, ViewChild} from '@angular/core';
import Tooltip from 'bootstrap/js/dist/tooltip';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './default-tooltip.html',
  styles: ``,
})
export class DefaultTooltip implements AfterViewChecked {
  @Input() text: string = '';
  @Input() placement: Placement = 'top';
  @ViewChild('tooltip') tooltip: ElementRef;

  ngAfterViewChecked(): void {
      new Tooltip(this.tooltip.nativeElement, {
        title: this.text,
        placement: this.placement,
        fallbackPlacements: [],
      });
  }
}
