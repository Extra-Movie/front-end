import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../services/server/series.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  SeriesResponseType,
  SeriesFilteredValuesType,
  Series,
} from '../../Types/series.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../../components/filter/filter/filter.component';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { LoadingState } from '../../Types/loading-state.model';
import { MovieGenreMatchType } from '../../Types/Movie.types';
import { FilterModelComponent } from '../filter/filter-modal/filter-modal.component';

@Component({
  selector: 'app-series',
  imports: [
    CommonModule,
    MediaCardComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FilterComponent,
    FilterModelComponent,
  ],
  providers: [SeriesService],
  templateUrl: './series.component.html',
  styles: ``,
})
export class SeriesComponent implements OnInit {
  constructor(
    private seriesService: SeriesService,
    private toast: ToastService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  //#region Properties
  seriesResponse!: SeriesResponseType;

  currentPage: number = 1;
  currentFilteredPage: number = 1;

  loading: boolean = false;

  pageSeries!: Series[];
  filteredPageSeries!: Series[];

  totalPages!: number;
  totalFilteredPages!: number;

  genreIDNamesObj: MovieGenreMatchType = JSON.parse(localStorage.getItem('genreTypesObj') ?? '{}');

  filterFlag: boolean = false;
  seriesPopularityVal: number = 65;

  filterSeriesValuesObj: SeriesFilteredValuesType = {
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
      const newFilterValues: SeriesFilteredValuesType = {
        nameValue: params['search'] ?? '',
        yearValue: params['year'] ?? '',
        genreValue: params['genre'] ? parseInt(params['genre']) : 0,
        voteValue: params['rating'] ?? '',
        popularityValue: params['popularity'] ?? '',
      };

      // Handle popularity alias values
      if (newFilterValues.popularityValue === 'Latest') {
        newFilterValues.popularityValue = '';
        newFilterValues.yearValue = '2025';
      } else if (newFilterValues.popularityValue === 'Top Rated') {
        newFilterValues.popularityValue = '';
        newFilterValues.voteValue = 8;
      } else if (newFilterValues.popularityValue === 'Most Popular') {
        newFilterValues.popularityValue = this.seriesPopularityVal;
      }

      this.filterFlag = !!(
        params['search'] ||
        params['year'] ||
        params['rating'] ||
        params['genre'] ||
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

      const savedFilter = sessionStorage.getItem('filterSeriesValuesObj');
      let prevFilterValues: SeriesFilteredValuesType = {
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

      this.filterSeriesValuesObj = newFilterValues;

      if (!isSameFilter) {
        this.currentFilteredPage = 1;
      } else {
        this.currentFilteredPage = parseInt(params['page'] ?? '1') || 1;
      }

      const targetPage = this.filterFlag
        ? this.currentFilteredPage
        : (this.currentPage = parseInt(params['page'] ?? '1') || 1);

      this.loadSeries(targetPage, this.filterSeriesValuesObj);
    });
  }

  loadSeries(pageNo: number, filterVal: SeriesFilteredValuesType): void {
    this.seriesService.getAllSeries(pageNo, filterVal).subscribe({
      next: (state: LoadingState<SeriesResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.seriesResponse = state.data;
          if (!this.filterFlag) {
            this.pageSeries = this.seriesResponse.tvShows;
            this.currentPage = this.seriesResponse.page;
            this.totalPages = this.seriesResponse.totalPages;
          } else {
            this.filteredPageSeries = this.seriesResponse.tvShows;
            this.currentFilteredPage = this.seriesResponse.page;
            this.totalFilteredPages = this.seriesResponse.totalPages;
          }
          this.saveCurrentState();
        } else if (state.state === 'error') {
          console.log('Error Loading Series', state.error);
          this.showErrorToast('Error Fetching Series');
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.showErrorToast('Error Fetching Series');
      },
    });

    this.saveCurrentState();
  }

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

  saveCurrentState(): void {
    sessionStorage.setItem('filterSeriesValuesObj', JSON.stringify(this.filterSeriesValuesObj));
  }

  restoreState() {
    const filterSeriesValuesObjStr = sessionStorage.getItem('filterSeriesValuesObj');
    try {
      this.filterSeriesValuesObj = filterSeriesValuesObjStr
        ? JSON.parse(filterSeriesValuesObjStr)
        : {
            nameValue: '',
            yearValue: '',
            genreValue: 0,
            voteValue: 0,
            popularityValue: 0,
          };
    } catch (e) {
      console.log('Failed to parse filterSeriesValuesObj:', e);
      this.filterSeriesValuesObj = {
        nameValue: '',
        yearValue: '',
        genreValue: 0,
        voteValue: 0,
        popularityValue: 0,
      };
    }
  }
}
