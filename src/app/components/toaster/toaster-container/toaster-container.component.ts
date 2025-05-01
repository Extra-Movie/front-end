import { Component } from '@angular/core';
import { ToasterComponent } from '../toaster/toaster.component';
import { Toast, ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toaster-container',
  imports: [ToasterComponent],
  templateUrl: './toaster-container.component.html',
  styles: ``,
})
export class ToasterContainerComponent {
  toasts: Toast[] = [];
  constructor(private toastService: ToastService) {
    this.toastService.toastState$.subscribe((toast) => {
      if (this.toasts.length >= 3) {
        this.removeToast(this.toasts[0]); // Remove the oldest toast if there are already 5
      }
      this.toasts.push(toast);
      setTimeout(() => {
        this.removeToast(toast);
      }, toast.duration || 3000); // Default duration is 3 seconds
    });
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
