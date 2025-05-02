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
    success: ' dark:bg-[#202521] bg-[#e0fff2] text-success shadow-success',
    error: ' dark:bg-[#3e1617] bg-[#eee4e4] text-error shadow-error ',
    info: ' dark:bg-[#112143] bg-[#f0fdff] text-info shadow-info',
    warning: ' dark:bg-[#281a11] bg-[#f8f7f1] text-warning shadow-warning',
    default: 'bg-base-200 text-primary shadow-primary',
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
