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
import {  ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from '../../components/filter/filter/filter.component';
import { MediaCardComponent } from '../../components/mediacard/mediacard.component';
import { LoadingState } from '../../Types/loading-state.model';


@Component({
  selector: 'app-movies',
  imports: [CommonModule,
    MediaCardComponent ,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule, FilterComponent],
    providers: [MovieService],
  templateUrl: './movies.component.html',
  styles: ``
})
export class MoviesComponent implements OnInit {
  constructor(private movieService: MovieService, private toast: ToastService , private activeRoute:ActivatedRoute) {
    let params! : any ;
    this.genreIDNamesObj = JSON.parse(localStorage.getItem('genreTypesObj')??"") ;
    console.log(this.genreIDNamesObj) ;
  }

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
  loadMovies(pageNo:number ,filterVal:MovieFilteredValuesType ):void{

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
            this.pageMovies = this.movieResponse.movies ;
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

}
