import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [NgbTooltipModule],
  templateUrl: './default-tooltip.html',
  styles: ``
})
export class DefaultTooltip {
  @Input() text: string = '';
  @Input() placement: Placement = 'top';
  @Input() showDelay?: number;
  @Input() hideDelay?: number;
}
