import { Component, computed, inject, OnInit } from '@angular/core';
import { MovieService } from './../../services/server/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { LoadingState } from '../../Types/loading-state.model';
import { Genre } from '../../Types/genres.types';
import {
  MovieFilteredValuesType,
  MovieType,
  MovieResponseType,
} from '../../Types/Movie.types';
import { GenresService } from '../../services/server/genres.service';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { solarStarBold } from '@ng-icons/solar-icons/bold';
import { currencyFormatter } from '../../utils/formatters';
import { WatchListService } from '../../services/watch-list.service';
import { CartService } from '../../services/cart.service';
import { faBookmark } from '@ng-icons/font-awesome/regular';
import {
  faSolidBookmark,
  faSolidCartShopping,
} from '@ng-icons/font-awesome/solid';
@Component({
  selector: 'app-movie-details-m',
  imports: [MediaCardComponent, CommonModule, HttpClientModule, NgIcon],
  providers: [
    MovieService,
    ToastService,
    provideIcons({
      solarStarBold,
      faBookmark,
      faSolidBookmark,
      faSolidCartShopping,
    }),
  ],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent implements OnInit {
  cart = inject(CartService);
  watchList = inject(WatchListService);
  isInWatchList = computed(() => {
    return this.watchList
      .watchList()
      ?.some((item) => item.item._id === this.movieID);
  });
  isInCart = computed(() => {
    return this.cart.cart()?.some((item) => item.item._id === this.movieID);
  });
  movieID!: string;
  movieDetails!: MovieType;
  loading: boolean = false;
  movieGenresState!: Genre[];
  movieCats: string[] = [];
  trailerLink!: string;
  relatedMovies!: MovieType[];
  displayedRelatedMovies: MovieType[] = [];
  movieResponse!: MovieResponseType;
  totalRelatedMovies: number = 4;
  formatCurrency = currencyFormatter;

  filterMovieValuesObj: MovieFilteredValuesType = {
    nameValue: '',
    yearValue: '',
    genreValue: 0,
    voteValue: 0,
    popularityValue: 0,
  };

  constructor(
    private movieService: MovieService,
    private activeRoute: ActivatedRoute,
    private toast: ToastService,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.movieID = params['id'];
      this.getMovieAllDetails(this.movieID);
      this.getMovieGenres();
    });
  }

  fillDisplayedRelatedMovies() {
    this.displayedRelatedMovies = [];
    let count = 0;
    let i = 0;
    while (
      count < this.relatedMovies.length &&
      count < this.totalRelatedMovies
    ) {
      //to avoid pushing same movie to display UI
      if (this.movieDetails._id != this.relatedMovies[i]._id) {
        count++;
        this.displayedRelatedMovies.push(this.relatedMovies[i]);
      }

      i++;
    }
  }

  loadRelatedMovies(pageNo: number, filterVal: MovieFilteredValuesType): void {
    this.movieService.getAllMovies(pageNo, filterVal).subscribe({
      next: (state: LoadingState<MovieResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.movieResponse = state.data;
          console.log('Normal');
          this.relatedMovies = this.movieResponse.movies;
          console.log('related movies', this.relatedMovies);
          this.fillDisplayedRelatedMovies();
          console.log('UI', this.displayedRelatedMovies);
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

  getMovieAllDetails(id: string) {
    this.movieService.getMovieDetails(id).subscribe({
      next: (state: LoadingState<any>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.movieDetails = state.data.movie;
          this.trailerLink = `https://www.youtube.com/results?search_query=${this.movieDetails.original_title} ${this.movieDetails.release_date}+trailer`;
          console.log(this.movieDetails);
          this.filterMovieValuesObj.yearValue = this.movieDetails.release_date;
          let randomGenreValue = Math.floor(
            (Math.random() * 100) % this.movieDetails.genre_ids.length
          );
          console.log('randomGenreValue', randomGenreValue);
          this.filterMovieValuesObj.genreValue =
            this.movieDetails.genre_ids[randomGenreValue];
          this.loadRelatedMovies(1, this.filterMovieValuesObj);
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

  getMovieGenres() {
    this.genresService.getMovieGenres().subscribe((state) => {
      if (state.state === 'loaded') {
        this.movieGenresState = state.data;
        this.extractMovieGenres();
        console.log(this.movieGenresState);
      }
    });
  }

  getImageSrc() {
    return (
      this.movieDetails.poster_path ||
      this.movieDetails.backdrop_path ||
      '/images/defaultMovie.webp'
    );
  }

  extractMovieGenres() {
    this.movieCats = [];
    this.movieDetails.genre_ids.forEach((gID) => {
      let matchItem = this.movieGenresState.filter((item) => {
        return gID === item.id ? item : null;
      });

      if (matchItem.length > 0) {
        let genreName = matchItem[0].name;
        this.movieCats.push(genreName);
      } else {
        console.log(`No matching genre found for ID: ${gID}`);
      }
    });

    console.log('matched cats', this.movieCats);
  }

  showErrorToast() {
    this.toast.error('Wrong API Response', {
      title: 'Error',
      duration: 3000,
      cancelable: true,
      showIcon: true,
    });
  }

  addToCart() {
    this.cart.addToCart({
      kind: 'movies',
      item: this.movieDetails,
      _id: this.movieID,
    });
  }
  addToWatchList() {
    this.watchList.addToWatchList({
      kind: 'movies',
      item: this.movieDetails,
      _id: this.movieID,
    });
  }
}
