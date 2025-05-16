import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidUser } from '@ng-icons/font-awesome/solid';
import { ionLogOutOutline } from '@ng-icons/ionicons';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  imports: [NgIcon, RouterLink, NgIf],
  templateUrl: './user-avatar.component.html',
  providers: [provideIcons({ faSolidUser, ionLogOutOutline })],
})
export class UserAvatarComponent {
  constructor(private authService: AuthService, public user: UserService) {}

  logout() {
    this.authService.logout();
  }
}
