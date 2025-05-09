import { Component, Input } from '@angular/core';
import {MovieType} from '../../Types/Movie.types' ;
import {Series} from '../../Types/series.model' ;



@Component({
  selector: 'app-mediaCard',
  imports: [],
  templateUrl: './mediacard.component.html',
  styles: ``
})
export class MediaCardComponent {
  @Input({ required: true }) mediaItem!: MovieType |Series;

  //get path depends on type of passed data as poster_path isn't working in series
  getImagePath(): string {

    if ('title' in this.mediaItem) {
      // It's a movie
      return this.mediaItem.poster_path || this.mediaItem.backdrop_path || '/images/defaultMovie.webp';
    } else if ('original_name' in this.mediaItem) {
      // It's a series
      return this.mediaItem.poster_path || this.mediaItem.backdrop_path|| '/images/defaultSeries.webp';
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

  addToCart(){

  }
  addToWatchList(){

  }

}
