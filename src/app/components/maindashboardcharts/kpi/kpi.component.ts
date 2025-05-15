import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi',
  imports: [CommonModule],
  templateUrl: './kpi.component.html',
  styles: ``,
})
export class KpiComponent {
  @Input() icon = 'fa-solid fa-users';
  @Input() title = 'Title';
  @Input() value = '0';
  @Input() year = new Date().getFullYear();
}
