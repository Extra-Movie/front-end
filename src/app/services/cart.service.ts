import { computed, Injectable, signal } from '@angular/core';
import { MovieType } from '../Types/Movie.types';
import { Series } from '../Types/series.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<(CartItem & { type: 'movie' | 'series' })[]>([
    {
      _id: '68111e2024b782956e9838ee',
      id: 911916,
      popularity: 7.5816,
      poster_path:
        'https://image.tmdb.org/t/p/original/rZ4arzyaDyI8l9Y7VIPPsDGARwh.jpg',
      title: 'Spider-Man: Beyond the Spider-Verse',
      price: 88,
      type: 'movie',
    },
    {
      _id: '68111d5e24b782956e982e49',
      id: 1003598,
      popularity: 8.5937,
      poster_path:
        'https://image.tmdb.org/t/p/original/f0YBuh4hyiAheXhh4JnJWoKi9g5.jpg',
      title: 'Avengers: Secret Wars',
      price: 110,
      type: 'movie',
    },
    {
      _id: '68111e9a24b782956e983f94',
      id: 1368337,
      popularity: 6.9063,
      poster_path:
        'https://image.tmdb.org/t/p/original/z5DhnCi8vSltpVqVZMSod4nFyYw.jpg',
      title: 'The Odyssey',
      price: 122,
      type: 'movie',
    },
  ]);
  cartCount = computed(() => this.cart().length);
  cartTotalPrice = computed(() => {
    return this.cart().reduce((total, movie) => {
      return total + movie.price;
    }, 0);
  });

  // ! use only the movie id to add to the cart and to make the api call to fetch the movie details
  addToCart(media: CartItem, type: 'movie' | 'series') {
    const mediaIndex = this.cart().findIndex((m) => m._id === media._id);
    if (mediaIndex === -1) {
      this.cart.update((prev) => [...prev, { ...media, type }]);
    }
  }

  // ! use only the media id to remove from the cart and to make the api call
  removeFromCart(media: CartItem) {
    this.cart.update((prev) => prev.filter((m) => m._id !== media._id));
  }
}

export type CartItem = {
  _id: string;
  id: number;
  popularity: number;
  poster_path: string;
  title: string;
  price: number;
};
