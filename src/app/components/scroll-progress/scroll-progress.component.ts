import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon , provideIcons } from '@ng-icons/core';
import {faSolidArrowUp} from '@ng-icons/font-awesome/solid'
@Component({
  selector: 'app-scroll-progress',
  templateUrl: './scroll-progress.component.html',
  imports:[CommonModule,FormsModule,NgIcon],
  styleUrls: [],
  viewProviders:[provideIcons({faSolidArrowUp})]
})
export class ScrollProgressComponent {
  scrollPercent = 0;
  showButton = false;

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollPercent = (scrollTop / docHeight) * 100;
    this.showButton = scrollTop > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}