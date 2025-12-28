import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]'
})
export class AutoResizeDirective {
  private readonly maxHeight = 200;

  constructor(private el: ElementRef<HTMLTextAreaElement>, private renderer: Renderer2) {}

  @HostListener('input')
  onInput(): void {
    const textarea = this.el.nativeElement;
    this.renderer.setStyle(textarea, 'height', 'auto');
    this.renderer.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
    if (textarea.scrollHeight >= this.maxHeight) {
      this.renderer.setStyle(textarea, 'overflow-y', 'auto');
    } else {
      this.renderer.setStyle(textarea, 'overflow-y', 'hidden');
    }
  }
}
