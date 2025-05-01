import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export type Toast = {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'default';
  duration?: number; // Duration in milliseconds
  cancelable?: boolean; // Whether the toast can be dismissed by the user
  showIcon?: boolean; // Whether to show an icon (default: true)
};
export type ToastOptions = Omit<Toast, 'type' | 'message'>;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toastState$ = this.toastSubject.asObservable();

  showToast(toast: Toast) {
    this.toastSubject.next(toast);
  }
  success(message: string, options: ToastOptions = {}) {
    this.showToast({ message, type: 'success', ...options });
  }
  error(message: string, options: ToastOptions = {}) {
    this.showToast({ message, type: 'error', ...options });
  }
  info(message: string, options: ToastOptions = {}) {
    this.showToast({ message, type: 'info', ...options });
  }
  warning(message: string, options: ToastOptions = {}) {
    this.showToast({ message, type: 'warning', ...options });
  }
  custom(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' | 'default',
    options: ToastOptions = {}
  ) {
    this.showToast({ message, type, ...options });
  }
}
