import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { LoadingState } from '../../Types/loading-state.model';
import { Genre } from '../../Types/genres.types';
import {
  Series,
  SeriesFilteredValuesType,
  SeriesResponseType,
} from '../../Types/series.model';
import { GenresService } from '../../services/server/genres.service';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { SeriesService } from '../../services/server/series.service';
import { currencyFormatter } from '../../utils/formatters';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { solarStarBold } from '@ng-icons/solar-icons/bold';

@Component({
  selector: 'app-series-details',
  imports: [MediaCardComponent, CommonModule, HttpClientModule, NgIcon],
  providers: [SeriesService, ToastService, provideIcons({ solarStarBold })],
  templateUrl: './series-details.component.html',
  styles: ``,
})
export class SeriesDetailsComponent implements OnInit {
  formatCurrency = currencyFormatter;
  seriesDetails!: Series;
  loading: boolean = false;
  seriesGenresState!: Genre[];
  seriesCats: string[] = [];
  trailerLink!: string;
  relatedSeries!: Series[];
  displayedRelatedseries: Series[] = [];
  seriesResponse!: SeriesResponseType;
  totalRelatedSeries: number = 4;

  filterSeriesValuesObj: SeriesFilteredValuesType = {
    nameValue: '',
    yearValue: '',
    genreValue: 0,
    voteValue: 0,
    popularityValue: 0,
  };

  series_ID!: string;

  constructor(
    private seriesService: SeriesService,
    private activeRoute: ActivatedRoute,
    private toast: ToastService,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.series_ID = params['id'];
      this.getSeriesAllDetails(this.series_ID);
      this.getSeriesGenres();
    });
  }

  fillDisplayedRelatedSeries() {
    this.displayedRelatedseries = [];
    let count = 0;
    let i = 0;
    while (
      count < this.relatedSeries.length &&
      count < this.totalRelatedSeries
    ) {
      //to avoid pushing same series to display UI
      if (this.seriesDetails._id != this.relatedSeries[i]._id) {
        count++;
        this.displayedRelatedseries.push(this.relatedSeries[i]);
      }

      i++;
    }
  }

  loadRelatedSeries(pageNo: number, filterVal: SeriesFilteredValuesType): void {
    this.seriesService.getAllSeries(pageNo, filterVal).subscribe({
      next: (state: LoadingState<SeriesResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.seriesResponse = state.data;
          console.log('Normal');
          this.relatedSeries = this.seriesResponse.tvShows;
          console.log('related movies', this.relatedSeries);
          this.fillDisplayedRelatedSeries();
          console.log('UI', this.displayedRelatedseries);
        } else if (state.state === 'error') {
          console.log('Error Loading Movies', state.error);
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.showErrorToast();
      },
    });
  }

  getSeriesAllDetails(id: string) {
    this.seriesService.getSeriesById(id).subscribe({
      next: (state: LoadingState<any>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          console.log('series data', state.data);
          this.seriesDetails = state.data.tvShow;
          this.trailerLink = `https://www.youtube.com/results?search_query=${this.seriesDetails.original_name} ${this.seriesDetails.first_air_date}+trailer`;
          console.log(this.seriesDetails);
          let randomGenreValue = Math.floor(
            (Math.random() * 100) % this.seriesDetails.genre_ids.length
          );
          console.log('randomGenreValue', randomGenreValue);
          this.filterSeriesValuesObj.genreValue =
            this.seriesDetails.genre_ids[randomGenreValue];
          this.filterSeriesValuesObj.yearValue =
            this.seriesDetails.first_air_date;
          this.loadRelatedSeries(1, this.filterSeriesValuesObj);
        } else if (state.state === 'error') {
          console.log('Error Loading Movies', state.error);
        }
      },
      error: (error) => {
        console.log(error);
        this.showErrorToast();
      },
      complete: () => console.log('completed Geners'),
    });
  }

  getSeriesGenres() {
    this.genresService.getSeriesGenres().subscribe((state) => {
      if (state.state === 'loaded') {
        this.seriesGenresState = state.data;
        this.extractSeriesGenres();
        console.log(this.seriesGenresState);
      }
    });
  }

  extractSeriesGenres() {
    this.seriesCats = [];
    this.seriesDetails.genre_ids.forEach((gID) => {
      let matchItem = this.seriesGenresState.filter((item) => {
        return gID === item.id ? item : null;
      });

      if (matchItem.length > 0) {
        let genreName = matchItem[0].name;
        this.seriesCats.push(genreName);
      } else {
        console.log(`No matching genre found for ID: ${gID}`);
      }
    });

    console.log('matched cats', this.seriesCats);
  }

  getImageSrc() {
    return (
      this.seriesDetails.poster_path ||
      this.seriesDetails.backdrop_path ||
      '/images/defaultSeries.webp'
    );
  }

  showErrorToast() {
    this.toast.error('Wrong API Response', {
      title: 'Error',
      duration: 3000,
      cancelable: true,
      showIcon: true,
    });
  }

  addToCart() {}

  addToWatchlist() {}
}
