import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidCartShopping,
  faSolidXmark,
} from '@ng-icons/font-awesome/solid';
import { CartService } from '../../services/cart.service';
import { CurrencyDirective } from '../../directives/currency.directive';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgIcon, CurrencyDirective, RouterLink, NgIf],
  templateUrl: './cart.component.html',
  providers: [provideIcons({ faSolidCartShopping, faSolidXmark })],
})
export class CartComponent {
  cart = inject(CartService);

  removeFromCart(event: Event, mediaId: string) {
    this.cart.removeFromCart(mediaId);
    event.stopPropagation();
    event.preventDefault();
  }
}
