import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import Tooltip from 'bootstrap/js/dist/tooltip';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './default-tooltip.html',
  styles: ``,
})
export class DefaultTooltip implements AfterViewChecked, OnDestroy {
  @Input() text: string = '';
  @Input() placement: Placement = 'top';
  @Input() showDelay: number | undefined;
  @Input() hideDelay: number | undefined;
  @ViewChild('tooltip') tooltip: ElementRef;

  private tooltipInstance: Tooltip;

  ngAfterViewChecked(): void {
      this.tooltipInstance = new Tooltip(this.tooltip.nativeElement, {
        title: this.text,
        placement: this.placement,
        fallbackPlacements: [],
        delay: {
          show: this.showDelay ?? 0,
          hide: this.hideDelay ?? 0,
        }
      });
  }

  ngOnDestroy(): void {
    if (this.tooltipInstance) {
      this.tooltipInstance.dispose();
    }
  }

}
