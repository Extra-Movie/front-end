import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { solarMoonStarsBold ,solarSun2Bold} from '@ng-icons/solar-icons/bold';
import { ionSearch } from '@ng-icons/ionicons';
@Component({
  selector: 'app-header',
  imports: [CommonModule,NgIcon],
  templateUrl: './header.component.html',
  styles: ``,
  viewProviders: [provideIcons({ faSolidCartShopping ,solarMoonStarsBold,solarSun2Bold, ionSearch})]
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
