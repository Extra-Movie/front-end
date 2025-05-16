import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { CartItem } from '../Types/User.types';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  user = inject(UserService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  cart = signal<CartItem[] | undefined>(undefined);
  cartState = this.user.cartState.state();
  cartCount = computed(() => this.cart()?.length);
  cartTotalPrice = computed(() => {
    return this.cart()?.reduce((total, movie) => {
      return total + movie.item.price;
    }, 0);
  });

  constructor() {
    effect(() => {
      if (!this.auth.isLoggedIn()) {
        this.cart.set(undefined);
      } else {
        this.getCart();
      }
    });
  }

  private getCart() {
    this.user.getCart().subscribe((res) => {
      if (res) {
        this.cart.set(res.cart.filter((item) => item.item));
      }
    });
  }

  addToCart(mediaItem: CartItem) {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to add items to cart', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    const mediaIndex = this.cart()?.findIndex(
      (m) => m.item._id === mediaItem.item._id
    );
    if (mediaIndex === -1) {
      this.user
        .addToCart({ item: mediaItem.item._id, kind: mediaItem.kind })
        .subscribe((res) => {
          if (res) {
            this.cart.update((prev) => {
              if (!prev) return [mediaItem];
              return [...prev, mediaItem];
            });
          }
          if (mediaItem.kind === 'movies') {
            this.toast.success(`${mediaItem.item.title} added to cart`, {
              title: 'Added successfully',
              showIcon: true,
              duration: 2000,
            });
          }
          if (mediaItem.kind === 'tvShows') {
            this.toast.success(`${mediaItem.item.name} added to cart`, {
              title: 'Added successfully',
              showIcon: true,
              duration: 2000,
            });
          }
        });
    }
    if (mediaIndex !== -1) {
      this.removeFromCart(mediaItem._id);
    }
  }

  removeFromCart(mediaId: CartItem['_id']) {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to remove items from cart', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    const kind = this.cart()?.find((m) => m.item._id === mediaId)?.kind;
    if (!kind) {
      this.toast.error('Item not found in cart', {
        title: 'Error',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    this.user.removeFromCart({ item: mediaId, kind }).subscribe((res) => {
      if (res) {
        this.cart.update((prev) => prev?.filter((m) => m.item._id !== mediaId));
        this.toast.success('Item removed from cart', {
          title: 'Removed successfully',
          showIcon: true,
          duration: 2000,
        });
      }
    });
  }
  updateCart() {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to clear cart', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    this.getCart();
  }

  clearCart() {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to clear cart', {
        title: 'Login required',
        showIcon: true,
        duration: 2000,
      });
      return;
    }
    this.cart.set(undefined);
  }
}
