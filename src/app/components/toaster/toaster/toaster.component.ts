import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Toast } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBellAlert,
  heroCheckCircle,
  heroExclamationCircle,
  heroInformationCircle,
  heroXCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-toaster',
  imports: [CommonModule, NgIcon],
  templateUrl: './toaster.component.html',
  providers: [
    provideIcons({
      heroXMark,
      heroCheckCircle,
      heroInformationCircle,
      heroExclamationCircle,
      heroXCircle,
      heroBellAlert,
    }),
  ],
})
export class ToasterComponent {
  @Input({ required: true }) toast!: Toast;
  @Output() close = new EventEmitter<void>();
  private TOAST_TYPES: Record<Toast['type'], string> = {
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error ',
    info: 'bg-info/10 text-info ',
    warning: 'bg-warning/10 text-warning ',
    default: 'bg-primary/10 text-primary',
  };

  private TOAST_ICONS: Record<Toast['type'], string> = {
    success: 'heroCheckCircle',
    error: 'heroXCircle',
    info: 'heroInformationCircle',
    warning: 'heroExclamationCircle',
    default: 'heroBellAlert',
  };

  get toastType() {
    return this.TOAST_TYPES[this.toast?.type || 'default'];
  }
  get toastIcon() {
    return this.TOAST_ICONS[this.toast?.type || 'default'];
  }
}
