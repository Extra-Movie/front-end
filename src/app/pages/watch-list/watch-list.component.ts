import { Component, computed, effect, signal } from '@angular/core';
import { CartItem } from '../../Types/User.types';
import { WatchListService } from '../../services/watch-list.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { single } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBookmark, faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { faBookmark } from '@ng-icons/font-awesome/regular';
import { bootstrapTv } from '@ng-icons/bootstrap-icons';
import { Router } from '@angular/router';
import { CurrencyDirective } from '../../directives/currency.directive';
@Component({
  selector: 'app-watch-list',
  imports: [CommonModule,FormsModule,NgIcon, CurrencyDirective],
  providers: [provideIcons({faSolidBookmark, faBookmark,faSolidCartShopping,bootstrapTv})],
  templateUrl: './watch-list.component.html',
  styles: ``
})
export class WatchListComponent {
  viewMode: 'grid1' | 'grid2' = 'grid1';
  arrowMode: 'up' | 'down' = 'up';
  watchListItems = signal<CartItem[] | undefined>(undefined);
  isLoading =signal<boolean>(true);
  totalPrice = computed(
    () =>
      this.watchListService.watchListTotalPrice()
  );

  constructor(private watchListService: WatchListService,private router: Router) {
    effect(() => {
      const data=this.watchListService.watchList();
      if(data===undefined)
      {
        this.isLoading.set(true);
      }
      else {
        this.watchListItems.set(data);
        this.isLoading.set(false);
      }
    });
  }

  removeItem(id: string) {
    this.watchListService.removeFromWatchList(id);
  }
  goToDetails(item: any) {
  const url = item.kind === 'movies' ? 'movies' : 'series';
  this.router.navigate([`/${url}`, item.item._id]);
}
sort() {
  const sorted = [...(this.watchListItems() || [])].sort((a, b) => {
    const titleA = a.kind === 'movies' ? a.item.title.toLowerCase() : a.item.name.toLowerCase();
    const titleB = b.kind === 'movies' ? b.item.title.toLowerCase() : b.item.name.toLowerCase();
    return titleA.localeCompare(titleB);
  });
  this.watchListItems.set(sorted);
  this.arrowMode='down';
}
descSort() {
  const sorted = [...(this.watchListItems() || [])].sort((a, b) => {
    const titleA = a.kind === 'movies' ? a.item.title.toLowerCase() : a.item.name.toLowerCase();
    const titleB = b.kind === 'movies' ? b.item.title.toLowerCase() : b.item.name.toLowerCase();
    return titleB.localeCompare(titleA);
  });
  this.watchListItems.set(sorted);
   this.arrowMode='up';
}

}
