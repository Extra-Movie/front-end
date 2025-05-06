import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mediacard',
  imports: [],
  templateUrl: './mediacard.component.html',
  styles: ``
})
export class MediacardComponent {
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
