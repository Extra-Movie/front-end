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
    success: ' dark:bg-[#002c16bf] bg-[#e0fff2] text-success',
    error: ' dark:bg-[#4c000bbd] bg-[#fff5f5bd] text-error ',
    info: ' dark:bg-[#001a5cc4] bg-[#f0fdff] text-info ',
    warning: ' dark:bg-[#3d1a0057] bg-[#fff8e2bd] text-warning ',
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
