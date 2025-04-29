import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  menuOpen = false;
  darkMode = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    const root = document.documentElement;
    if (this.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
