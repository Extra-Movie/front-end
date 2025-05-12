import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { ToastService } from '../../services/toast.service';


import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CarouselSeriesComponent } from "../../components/carouselseries/carouselseries.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, HeroComponent, CarouselComponent, CarouselSeriesComponent],
})
export class HomeComponent implements OnInit {
  constructor(
    private toast: ToastService,
    private theme: DarkModeService,
  ) {}



  ngOnInit(): void {
  }

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
