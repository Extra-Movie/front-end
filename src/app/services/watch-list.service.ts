import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { CartItem } from '../Types/User.types';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchListService {
  user = inject(UserService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  watchList = signal<CartItem[] | undefined>(undefined);
  watchListState = this.user.watchListState.state();
  watchListCount = computed(() => this.watchList()?.length);
  watchListTotalPrice = computed(() => {
    return this.watchList()?.reduce((total, movie) => {
      return total + movie.item.price;
    }, 0);
  });

  constructor() {
    effect(() => {
      if (!this.auth.isLoggedIn()) {
        this.watchList.set(undefined);
      } else {
        this.user.getWatchlist().subscribe((res) => {
          if (res) {
            this.watchList.set(res.watchlist.filter((item) => item.item));
          }
        });
      }
    });
  }

  addToWatchList(mediaItem: CartItem) {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to add items to watchList', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    const mediaIndex = this.watchList()?.findIndex(
      (m) => m.item._id === mediaItem.item._id
    );
    if (mediaIndex === -1) {
      this.user
        .addToWatchlist({ item: mediaItem.item._id, kind: mediaItem.kind })
        .subscribe((res) => {
          if (res) {
            this.watchList.update((prev) => {
              if (!prev) return [mediaItem];
              return [...prev, mediaItem];
            });
          }
          if (mediaItem.kind === 'movies') {
            this.toast.success(`${mediaItem.item.title} added to watchList`, {
              title: 'Added successfully',
              showIcon: true,
              duration: 2000,
            });
          }
          if (mediaItem.kind === 'tvShows') {
            this.toast.success(`${mediaItem.item.name} added to watchList`, {
              title: 'Added successfully',
              showIcon: true,
              duration: 2000,
            });
          }
        });
    }
    if (mediaIndex !== -1) {
      this.removeFromWatchList(mediaItem._id);
    }
  }

  removeFromWatchList(mediaId: CartItem['_id']) {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to remove items from watchList', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    const kind = this.watchList()?.find((m) => m.item._id === mediaId)?.kind;
    if (!kind) {
      this.toast.error('Item not found in watchList', {
        title: 'Error',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    this.user.removeFromWatchlist({ item: mediaId, kind }).subscribe((res) => {
      if (res) {
        this.watchList.update((prev) => prev?.filter((m) => m.item._id !== mediaId));
        this.toast.success('Item removed from watchList', {
          title: 'Removed successfully',
          showIcon: true,
          duration: 2000,
        });
      }
    });
  }
}
