import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeButtonComponent } from '../../components/theme-button/theme-button.component';
import { CartComponent } from '../../components/cart/cart.component';
import { AuthService } from '../../services/auth.service';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    ThemeButtonComponent,
    CartComponent,
    UserAvatarComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authService = inject(AuthService);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
