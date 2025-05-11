import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { currencyFormatter } from '../utils/formatters';

@Directive({
  selector: '[appCurrency]',
})
export class CurrencyDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const rawText = this.el.nativeElement.textContent || '';
    const numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ''));

    if (!isNaN(numericValue)) {
      this.el.nativeElement.textContent = currencyFormatter(numericValue);
    }
  }
}
