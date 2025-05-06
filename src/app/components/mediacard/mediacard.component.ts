import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mediaCard',
  imports: [],
  templateUrl: './mediaCard.component.html',
  styles: ``
})
export class MediaCardComponent {
  @Input({ required: true }) mediaItem!: {
    id: number;
    title: string;
    poster_path: string;
    popularity: number;
    overview: string;
    release_date: number;
    price: number;
    type: 'movie' | 'series';
  };
  addToCart(){

  }
  addToWatchList(){

  }

}
