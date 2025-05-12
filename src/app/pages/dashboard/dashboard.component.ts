import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionHomeOutline,
  ionLogOutOutline,
  ionTvOutline,
} from '@ng-icons/ionicons';
import { ThemeButtonComponent } from '../../components/theme-button/theme-button.component';
import {
  faSolidBarsStaggered,
  faSolidFilm,
  faSolidTv,
  faSolidUsersGear,
} from '@ng-icons/font-awesome/solid';
import { filter } from 'rxjs';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar/dashboard-sidebar.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-dashboard',
  imports: [
    ThemeButtonComponent,
    RouterOutlet,
    DashboardSidebarComponent,
    NgIcon,
  ],
  templateUrl: './dashboard.component.html',
  providers: [
    provideIcons({
      ionLogOutOutline,
      ionHomeOutline,
      faSolidUsersGear,
      faSolidFilm,
      faSolidTv,
      ionTvOutline,
      faSolidBarsStaggered,
    }),
  ],
})
export class DashboardComponent {
  currentTab = signal<string>('Dashboard');
  authService = inject(AuthService);
  toast = inject(ToastService);
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        let urls = event.urlAfterRedirects.split('/');
        if (urls.length > 2 && urls[2] !== 'main') {
          this.currentTab.set(
            urls[2].charAt(0).toUpperCase() + urls[2].slice(1)
          );
        } else {
          this.currentTab.set('Dashboard');
        }
      });
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.toast.error('You are not logged in', {
          title: 'Access Denied',
          showIcon: true,
        });
        this.router.navigate(['/login']);
      }
    });
  }
}
