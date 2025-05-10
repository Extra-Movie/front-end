import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { solarMoonStarsBold, solarSun2Bold } from '@ng-icons/solar-icons/bold';
import { ionSearch } from '@ng-icons/ionicons';
import { RouterLink } from '@angular/router';
import { ThemeButtonComponent } from "../../components/theme-button/theme-button.component";
import { CartComponent } from "../../components/cart/cart.component";
@Component({
  selector: 'app-header',
  imports: [CommonModule, NgIcon, RouterLink, ThemeButtonComponent, CartComponent],
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
