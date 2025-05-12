import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../services/server/series.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SeriesResponseType, SeriesFilteredValuesType, Series } from '../../Types/series.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
    FilterModelComponent
  ],
  providers: [SeriesService],
  templateUrl: './series.component.html',
  styles: ``,
})
export class SeriesComponent implements OnInit {
  constructor(
    private seriesService: SeriesService,
    private toast: ToastService,
    private activeRoute: ActivatedRoute
  ) {
    this.genreIDNamesObj = JSON.parse(localStorage.getItem('genreTypesObj') ?? '{}');
    console.log(this.genreIDNamesObj);
  }

  //#region Properties
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
  seriesPopularityVal:number = 65 ;

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
        genreValue: params['genre'] ? parseInt(params['genre']) : 0,
        voteValue: params['rating']??'',
        popularityValue: params['popularity']??''
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

      this.filterFlag = !!(params['search'] || params['year'] || params['rating'] || params['genres']||params['popularity']);
      const isSameFilter =
        JSON.stringify(newFilterValues) === JSON.stringify(prevFilterValues);

      this.filterSeriesValuesObj = newFilterValues;

      if (!isSameFilter) {
        this.currentFilteredPage = 1; // Reset page only on new filter
      } else {
        // Restore page if user is paginating without filter change
        this.currentFilteredPage = parseInt(sessionStorage.getItem('currentFilteredPageSeries') ?? '1');
      }

      const targetPage = this.filterFlag ? this.currentFilteredPage : this.currentPage;
      if(this.filterSeriesValuesObj.popularityValue==='Latest')
      {
        this.filterSeriesValuesObj.popularityValue = '' ;
        this.filterSeriesValuesObj.yearValue = '2025' ;
      }
      else if(this.filterSeriesValuesObj.popularityValue==='Top Rated')
      {
        this.filterSeriesValuesObj.popularityValue = '' ;
        this.filterSeriesValuesObj.voteValue = 8 ;
      }
      else if(this.filterSeriesValuesObj.popularityValue==='Most Popular')
      {
        this.filterSeriesValuesObj.popularityValue = this.seriesPopularityVal ;
      }

      this.loadSeries(targetPage, this.filterSeriesValuesObj);
    });
  }

  // load series
  loadSeries(pageNo: number, filterVal: SeriesFilteredValuesType): void {
    this.seriesService.getAllSeries(pageNo, filterVal).subscribe({
      next: (state: LoadingState<SeriesResponseType>) => {
        this.loading = state.state === 'loading';
        if (state.state === 'loaded') {
          this.seriesResponse = state.data;
          if (!this.filterFlag) {
            console.log('Normal');
            this.pageSeries = this.seriesResponse.tvShows;
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

  // next Page
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
        if(this.totalPages!=0)
        {
          this.currentPage = this.totalPages;
        }
        else
        {
          this.currentPage = 1 ;
        }
      }

      this.loadSeries(this.currentPage, this.filterSeriesValuesObj);
    } else {
      this.currentFilteredPage--;
      if (this.currentFilteredPage < 1) {
        if(this.totalFilteredPages!=0)
        {
          this.currentFilteredPage = this.totalFilteredPages;
        }
        else
        {
          this.currentFilteredPage = 1 ;
        }
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

  // using Session storage to store state
  saveCurrentState(): void {
    sessionStorage.setItem('currentPageSeries', String(this.currentPage));
    sessionStorage.setItem('currentFilteredPageSeries', String(this.currentFilteredPage));
    sessionStorage.setItem('filterSeriesValuesObj', JSON.stringify(this.filterSeriesValuesObj));
  }

  restoreState() {
    this.currentPage = parseInt(sessionStorage.getItem('currentPageSeries') ?? '1');
    this.currentFilteredPage = parseInt(sessionStorage.getItem('currentFilteredPageSeries') ?? '1');

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
