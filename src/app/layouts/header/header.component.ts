import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { solarMoonStarsBold, solarSun2Bold } from '@ng-icons/solar-icons/bold';
import { ionSearch } from '@ng-icons/ionicons';
import { DarkModeService } from '../../services/dark-mode.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIcon, RouterLink],
  templateUrl: './header.component.html',
  styles: ``,
  viewProviders: [
    provideIcons({
      faSolidCartShopping,
      solarMoonStarsBold,
      solarSun2Bold,
      ionSearch,
    }),
  ],
})
export class HeaderComponent {
  menuOpen = false;
  darkMode = false;
  constructor(private theme: DarkModeService) {
    theme.darkMode$.subscribe((mode) => {
      this.darkMode = mode === 'dark';
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDarkMode() {
    this.theme.toggleDarkMode();
  }
}
