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
import {  ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../../components/filter/filter/filter.component';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { LoadingState } from '../../Types/loading-state.model';
import { NgIcon , provideIcons } from '@ng-icons/core';
import { faSolidTrashArrowUp } from '@ng-icons/font-awesome/solid';
import {bootstrapStarFill} from '@ng-icons/bootstrap-icons';
import { currencyFormatter } from '../../utils/formatters';

@Component({
  selector: 'app-movies-table',
  imports: [CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,NgIcon,
  ],
    providers: [MovieService],
  templateUrl: './movies-table.component.html',
  styles: ``,
  viewProviders:[provideIcons({faSolidTrashArrowUp,bootstrapStarFill})]
})
export class MoviesTableComponent implements OnInit{
  formatCurrency = currencyFormatter
 constructor(private movieService: MovieService, private toast: ToastService , private activeRoute:ActivatedRoute , private router:Router) {
    let params! : any ;
    this.genreIDNamesObj = JSON.parse(localStorage.getItem('genreTypesObj')??"") ;
    console.log(this.genreIDNamesObj) ;
  }

  //#region Properties
  pageSize: number = 6;
    movieResponse!: MovieResponseType;
    movieFilteredResponse!: MovieResponseType;

    currentPage: number = 1;
    currentFilteredPage: number = 1;

    loading: boolean = false;

    pageMovies!: MovieType[];
    filteredPageMovies!: MovieType[];

    totalPages!: number;
    totalFilteredPages!: number;

    genreIDNamesObj! : MovieGenreMatchType ;

    filterFlag :boolean = false ;


    //value filter obj
    filterMovieValuesObj : MovieFilteredValuesType =
    {
      nameValue : "" ,
      yearValue : "" ,
      genreValue : 0 ,
      voteValue : 0 ,
      popularityValue : 0
    }

    //#endregion


    ngOnInit(): void {

      this.restoreState();

        this.activeRoute.queryParams.subscribe((params) => {
        console.log("Params", params);

        const newFilterValues: MovieFilteredValuesType = {
          nameValue: params['search'] ?? '',
          yearValue: params['year'] ?? '',
          genreValue: this.getGenreValue(params['genres']),
          voteValue: 0,
          popularityValue: 0
        };

        // Compare with previous values in sessionStorage
        const savedFilter = sessionStorage.getItem('filterMovieValuesObj');
        let prevFilterValues: MovieFilteredValuesType = {
          nameValue: '',
          yearValue: '',
          genreValue: 0,
          voteValue: 0,
          popularityValue: 0
        };

        if (savedFilter) {
          try {
            prevFilterValues = JSON.parse(savedFilter);
          } catch (e) {console.log(e)}
        }

        this.filterFlag = !!(params['search'] || params['year'] || params['rating'] || params['genres']);
        const isSameFilter =
          JSON.stringify(newFilterValues) === JSON.stringify(prevFilterValues);

        this.filterMovieValuesObj = newFilterValues;

        if (!isSameFilter) {
          this.currentFilteredPage = 1; // Reset page only on new filter
        } else {
          // Restore page if user is paginating without filter change
          this.currentFilteredPage = parseInt(sessionStorage.getItem('currentFilteredPage') ?? "1");
        }

        const targetPage = this.filterFlag ? this.currentFilteredPage : this.currentPage;
        this.loadMovies(targetPage, this.filterMovieValuesObj);
      });
    }

    getGenreValue(key: string): number {
      if (key && this.genreIDNamesObj?.hasOwnProperty(key)) {
        return this.genreIDNamesObj[key];
      }
      return 0;
    }



    //load movies
    loadMovies(pageNo:number ,filterVal:MovieFilteredValuesType   ):void{

      this.movieService.getAllMovies(pageNo,filterVal).subscribe(
        {
          next:(state:LoadingState<MovieResponseType>)=>{
          this.loading = state.state ==='loading' ;
          if(state.state==='loaded')
          {
            this.movieResponse = state.data ;

            if(!this.filterFlag)
            {
              console.log("Noraml");
             this.pageMovies = this.movieResponse.movies.slice(0, this.pageSize);
              this.currentPage = this.movieResponse.page ;
              this.totalPages = this.movieResponse.totalPages ;
            }
            else
            {
              console.log("filter");
              this.filteredPageMovies = this.movieResponse.movies ;
              this.currentFilteredPage = this.movieResponse.page ;
              this.totalFilteredPages = this.movieResponse.totalPages ;
            }
            this.saveCurrentState();

          }
          else if(state.state==='error')
          {
            console.log('Error Loading Movies' ,state.error) ;
          }
        },
        error : (error)=>{
          console.log("Error",error);
          this.showErrorToast('Error Fetching Movies');
        }

      }
      )

      this.saveCurrentState() ;
    }


    applySearchFilter() {
        const queryParams: any = {};

        if (this.filterMovieValuesObj.nameValue.trim()) {
          queryParams['search'] = this.filterMovieValuesObj.nameValue.trim();
        }

        // Add other filter params if needed
        this.currentFilteredPage = 1;
        sessionStorage.setItem('filterMovieValuesObj', JSON.stringify(this.filterMovieValuesObj));

        // Update the URL to trigger the queryParams observable
        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParams: queryParams,
          queryParamsHandling: 'merge', // Keep other params if needed
  });
  }


  onSearchChange(): void {
  const search = this.filterMovieValuesObj.nameValue.trim();

  // Update filter flag
  this.filterFlag = !!search;

  // Reset page
  this.currentFilteredPage = 1;

  // Update query params in URL (this triggers the route logic again)
  const queryParams: any = {
    ...(search && { search }), // Only include 'search' if not empty
    ...(this.filterMovieValuesObj.yearValue && { year: this.filterMovieValuesObj.yearValue }),
    ...(this.filterMovieValuesObj.genreValue && { genres: this.filterMovieValuesObj.genreValue })
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
      if (!this.filterFlag)
      {
        this.currentPage++;
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
        }

        this.loadMovies(this.currentPage,this.filterMovieValuesObj);
      }
      else
      {
        this.currentFilteredPage++;
        if (this.currentFilteredPage > this.totalFilteredPages) {
          this.currentFilteredPage = 1;
        }

        this.loadMovies(this.currentFilteredPage,this.filterMovieValuesObj);
      }

    }

    //previous page content
    previousPageContent() {
      if (!this.filterFlag)
      {
        this.currentPage--;
        if (this.currentPage < 1) {
          this.currentPage = this.totalPages;
        }

        this.loadMovies(this.currentPage,this.filterMovieValuesObj);
      }
      else
      {
        this.currentFilteredPage--;
        if (this.currentFilteredPage < 1) {
          this.currentFilteredPage = this.totalFilteredPages;
        }

        this.loadMovies(this.currentFilteredPage,this.filterMovieValuesObj);
      }
    }


    showErrorToast(errorMsg:string) {
      this.toast.error(errorMsg, {
        title: 'Error',
        duration: 3000,
        cancelable: true,
        showIcon: true,
      });
    }

    showSuccessToast(successMsg:string) {
      this.toast.success(successMsg, {
        title: 'Success',
        duration: 3000,
        cancelable: true,
        showIcon: true,
      });
    }


    //using Session storage to store state
    saveCurrentState() :void
    {
      sessionStorage.setItem('filterFlag',String(this.filterFlag)) ;
      sessionStorage.setItem('currentPage',String(this.currentPage)) ;
      sessionStorage.setItem('currentFilteredPage',String(this.currentFilteredPage)) ;
      sessionStorage.setItem('totalPages',String(this.totalPages)) ;
      sessionStorage.setItem('totalFilteredPages',String(this.totalFilteredPages)) ;
      sessionStorage.setItem('pageMovies',JSON.stringify(this.pageMovies)) ;
      sessionStorage.setItem('filteredPageMovies',JSON.stringify(this.filteredPageMovies)) ;
      sessionStorage.setItem('filterMovieValuesObj',JSON.stringify(this.filterMovieValuesObj)) ;
    }

    restoreState() {
      this.filterFlag = sessionStorage.getItem('filterFlag') === 'true';
      this.currentPage = parseInt(sessionStorage.getItem('currentPage') ?? "1");
      this.totalPages = parseInt(sessionStorage.getItem('totalPages') ?? "1");
      this.currentFilteredPage = parseInt(sessionStorage.getItem('currentFilteredPage') ?? "1");
      this.totalFilteredPages = parseInt(sessionStorage.getItem('totalFilteredPages') ?? "1");

      const movieContentArr = sessionStorage.getItem('pageMovies');
      try {
        this.pageMovies = movieContentArr ? JSON.parse(movieContentArr) : [];
      } catch (e) {
        console.log('Failed to parse pageMovies:', e);
        this.pageMovies = [];
      }

      const filteredPageMoviesArr = sessionStorage.getItem('filteredPageMovies');
      try {
        this.filteredPageMovies = filteredPageMoviesArr ? JSON.parse(filteredPageMoviesArr) : [];
      } catch (e) {
        console.log('Failed to parse filteredPageMovies:', e);
        this.filteredPageMovies = [];
      }

      const filterMovieValuesObjStr = sessionStorage.getItem('filterMovieValuesObj');
      try {
        this.filterMovieValuesObj = filterMovieValuesObjStr ? JSON.parse(filterMovieValuesObjStr) : {
          nameValue: "",
          yearValue: "",
          genreValue: 0,
          voteValue: 0,
          popularityValue: 0
        };
      } catch (e) {
        console.log('Failed to parse filterMovieValuesObj:', e);
        this.filterMovieValuesObj = {
          nameValue: "",
          yearValue: "",
          genreValue: 0,
          voteValue: 0,
          popularityValue: 0
        };
      }
    }

    deleteMovie(id: string) {
      this.movieService.deleteMovie(id).subscribe(
        {
          next: (state) => {
            console.log("Deleted",id);
            console.log(state);
            if (state.state === 'success') {
              this.showSuccessToast('Movie Deleted Successfully');
              this.loadMovies(this.currentPage, this.filterMovieValuesObj);
            }
            else if (state.state === 'error') {
              console.log('Error Deleting Movie', state.error);

              this.showErrorToast('Error Deleting Movie');
            }
          },
          error: (error:Error) => {
            console.log('Error Deleting Movie', error);
            this.showErrorToast('Error Deleting Movie');
          }
        }
      );
    }
}
