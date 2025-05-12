import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../services/server/series.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  SeriesResponseType,
  SeriesFilteredValuesType,
  Series,
} from '../../Types/series.model';
import { MovieGenreMatchType } from '../../Types/Movie.types';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingState } from '../../Types/loading-state.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidTrashArrowUp } from '@ng-icons/font-awesome/solid';
import { bootstrapStarFill } from '@ng-icons/bootstrap-icons';
import { currencyFormatter } from '../../utils/formatters';

@Component({
  selector: 'app-series-table',
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgIcon,
  ],
  providers: [SeriesService],
  templateUrl: './series-table.component.html',
  styles: ``,
  viewProviders: [provideIcons({ faSolidTrashArrowUp, bootstrapStarFill })],
})
export class SeriesTableComponent implements OnInit {
  formatCurrency = currencyFormatter
  constructor(
    private seriesService: SeriesService,
    private toast: ToastService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    let params!: any;
    this.genreIDNamesObj = JSON.parse(
      localStorage.getItem('genreTypesObj') ?? ''
    );
    console.log(this.genreIDNamesObj);
  }

  //#region Properties
  pageSize: number = 6;
  seriesResponse!: SeriesResponseType;
  seriesFilteredResponse!: SeriesResponseType;

  currentPage: number = 1;
  currentFilteredPage: number = 1;

  loading: boolean = false;

  pageSeries!: Series[];
  filteredPageSeries!: Series[];

  totalPages!: number;
  totalFilteredPages!: number;

  genreIDNamesObj!: MovieGenreMatchType;

  filterFlag: boolean = false;

  // value filter obj
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
      console.log('Params', params);

      const newFilterValues: SeriesFilteredValuesType = {
        nameValue: params['search'] ?? '',
        yearValue: params['year'] ?? '',
        genreValue: this.getGenreValue(params['genres']),
        voteValue: 0,
        popularityValue: 0,
      };

      // Compare with previous values in sessionStorage
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

      this.filterFlag = !!(
        params['search'] ||
        params['year'] ||
        params['rating'] ||
        params['genres']
      );
      const isSameFilter =
        JSON.stringify(newFilterValues) === JSON.stringify(prevFilterValues);

      this.filterSeriesValuesObj = newFilterValues;

      if (!isSameFilter) {
        this.currentFilteredPage = 1; // Reset page only on new filter
      } else {
        // Restore page if user is paginating without filter change
        this.currentFilteredPage = parseInt(
          sessionStorage.getItem('currentFilteredPageSeries') ?? '1'
        );
      }

      const targetPage = this.filterFlag
        ? this.currentFilteredPage
        : this.currentPage;
      this.loadSeries(targetPage, this.filterSeriesValuesObj);
    });
  }

  getGenreValue(key: string): number {
    if (key && this.genreIDNamesObj?.hasOwnProperty(key)) {
      return this.genreIDNamesObj[key];
    }
    return 0;
  }

  //load series
  loadSeries(pageNo: number, filterVal: SeriesFilteredValuesType): void {
    this.seriesService.getAllSeries(pageNo, filterVal).subscribe({
      next: (state: LoadingState<SeriesResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.seriesResponse = state.data;
          if (!this.filterFlag) {
            console.log('Normal');
            this.pageSeries = this.seriesResponse.tvShows.slice(
              0,
              this.pageSize
            );
            this.currentPage = this.seriesResponse.page;
            this.totalPages = this.seriesResponse.totalPages;
          } else {
            console.log('Filter');
            this.filteredPageSeries = this.seriesResponse.tvShows;
            this.currentFilteredPage = this.seriesResponse.page;
            this.totalFilteredPages = this.seriesResponse.totalPages;
          }
          this.saveCurrentState();
        } else if (state.state === 'error') {
          console.log('Error Loading Series', state.error);
        }
      },
      error: (error) => {
        console.log('Error', error);
        this.showErrorToast('Error Fetching Series');
      },
    });

    this.saveCurrentState();
  }

  applySearchFilter() {
    const queryParams: any = {};

    if (this.filterSeriesValuesObj.nameValue.trim()) {
      queryParams['search'] = this.filterSeriesValuesObj.nameValue.trim();
    }

    // Add other filter params if needed
    this.currentFilteredPage = 1;
    sessionStorage.setItem(
      'filterSeriesValuesObj',
      JSON.stringify(this.filterSeriesValuesObj)
    );

    // Update the URL to trigger the queryParams observable
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Keep other params if needed
    });
  }

  onSearchChange(): void {
    const search = this.filterSeriesValuesObj.nameValue.trim();

    // Update filter flag
    this.filterFlag = !!search;

    // Reset page
    this.currentFilteredPage = 1;

    // Update query params in URL (this triggers the route logic again)
    const queryParams: any = {
      ...(search && { search }), // Only include 'search' if not empty
      ...(this.filterSeriesValuesObj.yearValue && {
        year: this.filterSeriesValuesObj.yearValue,
      }),
      ...(this.filterSeriesValuesObj.genreValue && {
        genres: this.filterSeriesValuesObj.genreValue,
      }),
      // Add other filters if needed
    };

    // Update the route (this will reload data in ngOnInit)
    history.replaceState({}, '', location.pathname); // Clear query params if empty
    if (Object.keys(queryParams).length > 0) {
      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: {},
      });
    }
  }

  //next Page

  nextPageContent() {
    if (!this.filterFlag) {
      this.currentPage++;
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }

      this.loadSeries(this.currentPage, this.filterSeriesValuesObj);
    } else {
      this.currentFilteredPage++;
      if (this.currentFilteredPage > this.totalFilteredPages) {
        this.currentFilteredPage = 1;
      }

      this.loadSeries(this.currentFilteredPage, this.filterSeriesValuesObj);
    }
  }

  // previous page content
  previousPageContent() {
    if (!this.filterFlag) {
      this.currentPage--;
      if (this.currentPage < 1) {
        this.currentPage = this.totalPages;
      }

      this.loadSeries(this.currentPage, this.filterSeriesValuesObj);
    } else {
      this.currentFilteredPage--;
      if (this.currentFilteredPage < 1) {
        this.currentFilteredPage = this.totalFilteredPages;
      }

      this.loadSeries(this.currentFilteredPage, this.filterSeriesValuesObj);
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

  showSuccessToast(successMsg: string) {
    this.toast.success(successMsg, {
      title: 'Success',
      duration: 3000,
      cancelable: true,
      showIcon: true,
    });
  }

  // using Session storage to store state
  saveCurrentState(): void {
    sessionStorage.setItem('filterFlagSeries', String(this.filterFlag));
    sessionStorage.setItem('currentPageSeries', String(this.currentPage));
    sessionStorage.setItem(
      'currentFilteredPageSeries',
      String(this.currentFilteredPage)
    );
    sessionStorage.setItem('totalPagesSeries', String(this.totalPages));
    sessionStorage.setItem(
      'totalFilteredPagesSeries',
      String(this.totalFilteredPages)
    );
    sessionStorage.setItem('pageSeries', JSON.stringify(this.pageSeries));
    sessionStorage.setItem(
      'filteredPageSeries',
      JSON.stringify(this.filteredPageSeries)
    );
    sessionStorage.setItem(
      'filterSeriesValuesObj',
      JSON.stringify(this.filterSeriesValuesObj)
    );
  }

  restoreState() {
    this.filterFlag = sessionStorage.getItem('filterFlagSeries') === 'true';
    this.currentPage = parseInt(
      sessionStorage.getItem('currentPageSeries') ?? '1'
    );
    this.totalPages = parseInt(
      sessionStorage.getItem('totalPagesSeries') ?? '1'
    );
    this.currentFilteredPage = parseInt(
      sessionStorage.getItem('currentFilteredPageSeries') ?? '1'
    );
    this.totalFilteredPages = parseInt(
      sessionStorage.getItem('totalFilteredPagesSeries') ?? '1'
    );

    const seriesContentArr = sessionStorage.getItem('pageSeries');
    try {
      this.pageSeries = seriesContentArr ? JSON.parse(seriesContentArr) : [];
    } catch (e) {
      console.log('Failed to parse pageSeries:', e);
      this.pageSeries = [];
    }

    const filteredPageSeriesArr = sessionStorage.getItem('filteredPageSeries');
    try {
      this.filteredPageSeries = filteredPageSeriesArr
        ? JSON.parse(filteredPageSeriesArr)
        : [];
    } catch (e) {
      console.log('Failed to parse filteredPageSeries:', e);
      this.filteredPageSeries = [];
    }

    const filterSeriesValuesObjStr = sessionStorage.getItem(
      'filterSeriesValuesObj'
    );
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

  deleteSeries(id: string) {
    this.seriesService.deleteSeriesById(id).subscribe({
      next: (state) => {
        console.log('Deleted', id);
        console.log(state);
        if (state.state === 'success') {
          this.showSuccessToast('Series Deleted Successfully');
          this.loadSeries(this.currentPage, this.filterSeriesValuesObj);
        } else if (state.state === 'error') {
          console.log('Error Deleting Movie', state.error);

          this.showErrorToast('Error Deleting Movie');
        }
      },
      error: (error) => {
        console.log('Error Deleting Movie', error);
        this.showErrorToast('Error Deleting Movie');
      },
    });
  }
}
