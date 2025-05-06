import { Component } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { ToasterComponent } from '../../components/toaster/toaster/toaster.component';
import { ToastService } from '../../services/toast.service';
import { FilterComponent } from "../filter/filter/filter.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FilterComponent],
})
export class HomeComponent {
  constructor(private toast: ToastService, private theme: DarkModeService) {}

  showToast() {
    this.toast.success('this is a success toast', {
      title: 'Success',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }
  showErrorToast() {
    this.toast.error('this is an error toast', {
      title: 'Error',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  showInfoToast() {
    this.toast.info('this is an info toast', {
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  showWarningToast() {
    this.toast.warning('this is a warning toast', {
      title: 'Warning',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }
  showPrimaryToast() {
    this.toast.custom('this is a primary toast', 'default', {
      title: 'Primary',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  toggleTheme() {
    this.theme.toggleDarkMode();
  }
}
