import { Component, computed, inject, Input } from '@angular/core';
import { MovieType } from '../../Types/Movie.types';
import { Series } from '../../Types/series.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WatchListService } from '../../services/watch-list.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBookmark, faSolidCartShopping } from '@ng-icons/font-awesome/solid';
import { faBookmark } from '@ng-icons/font-awesome/regular';

RouterLink;

@Component({
  selector: 'app-mediaCard',
  imports: [RouterLink, NgIcon],
  templateUrl: './mediacard.component.html',
  providers: [provideIcons({faSolidBookmark, faBookmark,faSolidCartShopping})],
})
export class MediaCardComponent {
  @Input({ required: true }) mediaItem!: MovieType | Series;

  cart = inject(CartService);
  watchList = inject(WatchListService);
  isInWatchList = computed(() => {
    return this.watchList
      .watchList()
      ?.some((item) => item.item._id === this.mediaItem._id);
  });
  isInCart = computed(() => {
    if ('title' in this.mediaItem) {
      return this.cart
        .cart()
        ?.some((item) => item.item._id === this.mediaItem._id);
    } else if ('original_name' in this.mediaItem) {
      return this.cart
        .cart()
        ?.some((item) => item.item._id === this.mediaItem._id);
    }
    return false;
  });
  //get path depends on type of passed data as poster_path isn't working in series
  getImagePath(): string {
    if ('title' in this.mediaItem) {
      // It's a movie
      return (
        this.mediaItem.poster_path ||
        this.mediaItem.backdrop_path ||
        '/images/defaultMovie.webp'
      );
    } else if ('original_name' in this.mediaItem) {
      // It's a series
      return (
        this.mediaItem.poster_path ||
        this.mediaItem.backdrop_path ||
        '/images/defaultSeries.webp'
      );
    }
    return '/images/defaultSeries.webp';
  }

  //extract title from passed media type
  getTitle(): string {
    if ('title' in this.mediaItem) {
      return this.mediaItem.title;
    } else if ('original_name' in this.mediaItem) {
      return this.mediaItem.original_name;
    }
    return 'Unknown Title';
  }

  //direct To path

  directToPath(): string {
    if ('title' in this.mediaItem) {
      return `/movies/${this.mediaItem._id}`;
    }
    return `/series/${this.mediaItem._id}`;
  }

  addToCart() {
    if ('title' in this.mediaItem) {
      this.cart.addToCart({
        kind: 'movies',
        item: this.mediaItem,
        _id: this.mediaItem._id,
      });
    } else if ('original_name' in this.mediaItem) {
      this.cart.addToCart({
        kind: 'tvShows',
        item: this.mediaItem,
        _id: this.mediaItem._id,
      });
    }
  }
  addToWatchList() {
    if ('title' in this.mediaItem) {
      this.watchList.addToWatchList({
        kind: 'movies',
        item: this.mediaItem,
        _id: this.mediaItem._id,
      });
    } else if ('original_name' in this.mediaItem) {
      this.watchList.addToWatchList({
        kind: 'tvShows',
        item: this.mediaItem,
        _id: this.mediaItem._id,
      });
    }
  }
}
