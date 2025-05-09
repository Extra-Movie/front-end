import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidFilm,
  faSolidTv,
  faSolidUsersGear,
} from '@ng-icons/font-awesome/solid';
import { ionHomeOutline, ionTvOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, NgIcon, RouterLinkActive],
  templateUrl: './dashboard-sidebar.component.html',
  providers: [
    provideIcons({
      ionHomeOutline,
      faSolidUsersGear,
      faSolidFilm,
      faSolidTv,
      ionTvOutline,
    }),
  ],
})
export class DashboardSidebarComponent {
  @Input() drawerToggler: HTMLInputElement | null = null;

  toggleDrawer() {
    if (this.drawerToggler) {
      this.drawerToggler.checked = !this.drawerToggler.checked;
    }
  }
}
