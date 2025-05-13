import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/server/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  MovieType,
  MovieResponseType,
  MovieGenreMatchType,
  MovieFilteredValuesType,
} from '../../Types/Movie.types';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { LoadingState } from '../../Types/loading-state.model';
import { FilterComponent } from '../../components/filter/filter/filter.component';
import { FilterModelComponent } from '../filter/filter-modal/filter-modal.component';

FilterModelComponent;

@Component({
  selector: 'app-movies',
  imports: [
    CommonModule,
    MediaCardComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FilterComponent,
    FilterModelComponent,
  ],
  providers: [MovieService],
  templateUrl: './movies.component.html',
  styles: ``,
})
export class MoviesComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private toast: ToastService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  //#region Properties
  movieResponse!: MovieResponseType;
  movieFilteredResponse!: MovieResponseType;

  currentPage: number = 1;
  currentFilteredPage: number = 1;

  loading: boolean = false;

  pageMovies!: MovieType[];
  filteredPageMovies!: MovieType[];

  totalPages!: number;
  totalFilteredPages!: number;

  genreIDNamesObj!: MovieGenreMatchType;

  filterFlag: boolean = false;
  moviePopularityVal: number = 15;

  //value filter obj
  filterMovieValuesObj: MovieFilteredValuesType = {
    nameValue: '',
    yearValue: '',
    genreValue: 0,
    voteValue: 0,
    popularityValue: 0,
  };

  //#endregion

  ngOnInit(): void {
    this.restoreState();

    this.activeRoute.queryParams.subscribe((params) => {
      const newFilterValues: MovieFilteredValuesType = {
        nameValue: params['search'] ?? '',
        yearValue: params['year'] ?? '',
        genreValue: params['genre'] ? parseInt(params['genre']) : 0,
        voteValue: params['rating'] ?? '',
        popularityValue: params['popularity'] ?? '',
      };

      if (newFilterValues.popularityValue === 'Latest') {
        newFilterValues.popularityValue = '';
        newFilterValues.yearValue = '2025';
      } else if (newFilterValues.popularityValue === 'Top Rated') {
        newFilterValues.popularityValue = '';
        newFilterValues.voteValue = 8;
      } else if (newFilterValues.popularityValue === 'Most Popular') {
        newFilterValues.popularityValue = this.moviePopularityVal;
      }

      this.filterFlag = !!(
        params['search'] ||
        params['year'] ||
        params['rating'] ||
        params['genres'] ||
        params['popularity']
      );

      if (!params['page']) {
        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParams: { ...params, page: 1 },
          queryParamsHandling: 'merge',
        });
        return;
      }
      console.log('Params', params);

      if (!this.filterFlag) {
        this.currentPage = parseInt(params['page'] ?? '1') || 1;
      } else {
        this.currentFilteredPage = parseInt(params['page'] ?? '1') || 1;
      }
      console.log(this.currentFilteredPage);

      // Compare with previous values in sessionStorage
      const savedFilter = sessionStorage.getItem('filterMovieValuesObj');
      let prevFilterValues: MovieFilteredValuesType = {
        nameValue: '',
        yearValue: '',
        genreValue: 0,
        voteValue: 0,
        popularityValue: 0,
      };

      if (savedFilter) {
        try {
          prevFilterValues = JSON.parse(savedFilter);
        } catch (e) {
          console.log(e);
        }
      }

      const isSameFilter =
        JSON.stringify(newFilterValues) === JSON.stringify(prevFilterValues);

      this.filterMovieValuesObj = newFilterValues;

      if (!isSameFilter) {
        this.currentFilteredPage = 1;
      } else {
        this.currentFilteredPage = parseInt(params['page'] ?? '1') || 1;
      }

      const targetPage = this.filterFlag
        ? this.currentFilteredPage
        : this.currentPage;

      this.loadMovies(targetPage, this.filterMovieValuesObj);
    });
  }

  //load movies
  loadMovies(pageNo: number, filterVal: MovieFilteredValuesType): void {
    this.movieService.getAllMovies(pageNo, filterVal).subscribe({
      next: (state: LoadingState<MovieResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.movieResponse = state.data;
          if (!this.filterFlag) {
            console.log('Noraml');
            this.pageMovies = this.movieResponse.movies;
            this.currentPage = this.movieResponse.page;
            this.totalPages = this.movieResponse.totalPages;
            console.log('total Normal', this.totalFilteredPages);
          } else {
            console.log('filter');
            this.filteredPageMovies = this.movieResponse.movies;
            this.currentFilteredPage = this.movieResponse.page;
            this.totalFilteredPages = this.movieResponse.totalPages;
            console.log('total filter', this.totalFilteredPages);
          }
          this.saveCurrentState();
        } else if (state.state === 'error') {
          console.log('Error Loading Movies', state.error);
          this.showErrorToast('Error Fetching Movies');
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.showErrorToast('Error Fetching Movies');
      },
    });

    this.saveCurrentState();
  }

  //next Page

  nextPageContent() {
    if (!this.filterFlag) {
      this.currentPage++;
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
      });
    } else {
      this.currentFilteredPage++;
      if (this.currentFilteredPage > this.totalFilteredPages) {
        this.currentFilteredPage = 1;
      }
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { page: this.currentFilteredPage },
        queryParamsHandling: 'merge',
      });
    }
  }

  //previous page content
  previousPageContent() {
    if (!this.filterFlag) {
      this.currentPage--;
      if (this.currentPage < 1) {
        this.currentPage = this.totalPages || 1;
      }
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
      });
    } else {
      this.currentFilteredPage--;
      if (this.currentFilteredPage < 1) {
        this.currentFilteredPage = this.totalFilteredPages || 1;
      }
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { page: this.currentFilteredPage },
        queryParamsHandling: 'merge',
      });
    }
  }

  showErrorToast(errorMsg: string) {
    this.toast.error(errorMsg, {
      title: 'Error',
      duration: 3000,
      cancelable: true,
      showIcon: true,
    });
  }

  //using Session storage to store state
  saveCurrentState(): void {
    sessionStorage.setItem(
      'filterMovieValuesObj',
      JSON.stringify(this.filterMovieValuesObj)
    );
  }

  restoreState() {
    const filterMovieValuesObjStr = sessionStorage.getItem(
      'filterMovieValuesObj'
    );
    try {
      this.filterMovieValuesObj = filterMovieValuesObjStr
        ? JSON.parse(filterMovieValuesObjStr)
        : {
            nameValue: '',
            yearValue: '',
            genreValue: 0,
            voteValue: 0,
            popularityValue: 0,
          };
    } catch (e) {
      console.log('Failed to parse filterMovieValuesObj:', e);
      this.filterMovieValuesObj = {
        nameValue: '',
        yearValue: '',
        genreValue: 0,
        voteValue: 0,
        popularityValue: 0,
      };
    }
  }
}
