import { Component, effect, signal } from '@angular/core';
import { CartItem, OwnedResponse } from '../../Types/User.types';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidTv } from '@ng-icons/font-awesome/solid';
import { faSolidBookmark, faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { faBookmark } from '@ng-icons/font-awesome/regular';
import { bootstrapTv } from '@ng-icons/bootstrap-icons';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-owned',
  imports: [CommonModule,FormsModule,NgIcon],
  providers: [provideIcons({faSolidBookmark, faBookmark,faSolidCartShopping,bootstrapTv})],
  templateUrl: './owned.component.html',
  styles: ``
})
export class OwnedComponent {
  viewMode: 'grid1' | 'grid2' = 'grid1';
  arrowMode: 'up' | 'down' = 'up';
  ownedItems = signal<CartItem[]>([]);
  isLoading = signal(true);

  constructor(private userService: UserService, private router: Router) {
    this.userService.getOwned().subscribe((res) => {
      if (res && res.owned) {
        this.ownedItems.set(res.owned);
      } else {
        this.ownedItems.set([]);
      }
      this.isLoading.set(false);
    });
  }

  goToDetails(item: any) {
    const url = item.kind === 'movies' ? 'movies' : 'series';
    this.router.navigate([`/${url}`, item._id]);
  }
  sort() {
  const sorted = [...(this.ownedItems() || [])].sort((a, b) => {
    const titleA = a.kind === 'movies' ? a.item.title.toLowerCase() : a.item.name.toLowerCase();
    const titleB = b.kind === 'movies' ? b.item.title.toLowerCase() : b.item.name.toLowerCase();
    return titleA.localeCompare(titleB);
  });
  this.ownedItems.set(sorted);
  this.arrowMode='down';
}
descSort() {
  const sorted = [...(this.ownedItems() || [])].sort((a, b) => {
    const titleA = a.kind === 'movies' ? a.item.title.toLowerCase() : a.item.name.toLowerCase();
    const titleB = b.kind === 'movies' ? b.item.title.toLowerCase() : b.item.name.toLowerCase();
    return titleB.localeCompare(titleA);
  });
  this.ownedItems.set(sorted);
   this.arrowMode='up';
}
}
