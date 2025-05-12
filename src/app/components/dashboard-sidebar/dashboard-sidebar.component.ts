import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidFilm,
  faSolidTv,
  faSolidUsersGear,
} from '@ng-icons/font-awesome/solid';
import { ionHomeOutline, ionTvOutline } from '@ng-icons/ionicons';
import { AuthService } from '../../services/auth.service';

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
  auth = inject(AuthService);
  router = inject(Router);
  toggleDrawer() {
    if (this.drawerToggler) {
      this.drawerToggler.checked = !this.drawerToggler.checked;
    }
  }
  logout() {
    this.auth.logout();
    if (this.drawerToggler) {
      this.drawerToggler.checked = false;
    }
    this.router.navigate(['/']);
  }
}
