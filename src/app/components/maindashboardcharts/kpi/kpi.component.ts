import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi',
  imports: [CommonModule],
  templateUrl: './kpi.component.html',
  styles: ``,
})
export class KpiComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() year = new Date().getFullYear();
}
