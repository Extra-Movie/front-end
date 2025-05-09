import { Component } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { solarMoonStarsBold, solarSun2Bold } from '@ng-icons/solar-icons/bold';

@Component({
  selector: 'app-theme-button',
  imports: [NgIcon],
  templateUrl: './theme-button.component.html',
  providers: [provideIcons({ solarSun2Bold, solarMoonStarsBold })],
})
export class ThemeButtonComponent {
  darkMode = false;
  constructor(private theme: DarkModeService) {
    theme.darkMode$.subscribe((mode) => {
      this.darkMode = mode === 'dark';
    });
  }

  toggleDarkMode() {
    this.theme.toggleDarkMode();
  }
}
