import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/server/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  MovieType,
  MovieResponseType,
  MovieGenreType,
  MovieFilterStatusType,
  MovieFilteredValuesType,
} from '../../Types/Movie.types';
import {  RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-movie',
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [MovieService],
  templateUrl: './test-movie.component.html',
  styles: ``,
})
export class TestMovieComponent implements OnInit {
  constructor(private movieService: MovieService, private toast: ToastService) {
    const startYear = 1930;
    const endYear = 2030;
    for (let y = endYear; y >= startYear; y--) {
      this.years.push(y);
    }
  }

  movieResponse!: MovieResponseType;
  movieFilteredResponse!: MovieResponseType;

  currentPage: number = 1;
  currentFilteredPage: number = 1;

  pageMovies!: MovieType[];
  filteredPageMovies!: MovieType[];

  totalPages!: number;
  totalFilteredPages!: number;

  movieGeners!: MovieGenreType[];

  years: number[] = [];

  filterFlag :boolean = false ;

  //status filter obj
  filterMovieStatusObj : MovieFilterStatusType =
  {
    nameState : false ,
    yearState : false ,
    genreState : false ,
    voteState : false ,
    popularityState : false
  }


  //value filter obj
  filterMovieValuesObj : MovieFilteredValuesType =
  {
    nameValue : "inception" ,
    yearValue : "2015" ,
    genreValue : 8 ,
    voteValue : 10 ,
    popularityValue : 55
  }

  //use this to take search input or field related to genre and map it to its id to pass it as parameter for filtering
  movieGenersIDGenerated: { [key: string]: number } = {};

  ngOnInit(): void {

    //geners =>
    this.movieService.getMovieGeners().subscribe({
      next: (data: any) => {
        this.movieGeners = data;
        for (let i = 0; i < this.movieGeners.length; i++) {
          this.movieGenersIDGenerated[this.movieGeners[i].name] =
            this.movieGeners[i].id;
        }

        console.log(this.movieGenersIDGenerated) ;
      },
      error: (error) => {
        console.log(error);
        this.showErrorToast('error API movie Genres');
      },
      complete: () => console.log('completed Geners'),
    });

    this.restoreState() ;

    if(!this.filterFlag)
    {
      //page content
      this.movieService.getMoviesCustomPage(this.currentPage).subscribe({
        next: (data: any) => {
          console.log("current Page", this.currentFilteredPage) ;
          this.movieResponse = data;
          this.pageMovies = this.movieResponse.movies;
          console.log('movieResponse', this.movieResponse);
          this.totalPages = data.totalPages;
          console.log(this.totalPages);
        },
        error: (error) => {
          console.log(error);
          this.showErrorToast('error getting API first Movie Page');
        },
        complete: () => console.log('completed Movies'),
      });
    }

    //filter flag => true
    else
    {

      this.movieService.getMovieFilterAll(this.filterMovieStatusObj,this.filterMovieValuesObj).subscribe({
        next: (fData: any) => {
          this.movieFilteredResponse = fData;
          this.filteredPageMovies = this.movieFilteredResponse.movies;
          this.totalFilteredPages = fData.totalPages;
        },
        error: (error) => {
          console.log(error);
          this.showErrorToast('error API movie Filter all first execution');
        },
        complete: () => console.log('completed'),
      });

      this.getPageMovieContent(this.currentFilteredPage) ;

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

      this.getPageMovieContent(this.currentPage);
    }
    else
    {
      this.currentFilteredPage++;
      if (this.currentFilteredPage > this.totalFilteredPages) {
        this.currentFilteredPage = 1;
      }

      this.getPageMovieContent(this.currentFilteredPage);
    }

  }

  //previous page content
  previousPageContent() {
    if (!this.filterFlag)
      {
        this.currentPage--;
        if (this.currentPage < 1) {
          this.currentPage = 1;
        }

        this.getPageMovieContent(this.currentPage);
      }
      else
      {
        this.currentFilteredPage--;
        if (this.currentFilteredPage < 1) {
          this.currentFilteredPage = 1;
        }

        this.getPageMovieContent(this.currentFilteredPage);
      }
  }

  //get Whole Page Content
  getPageMovieContent(pageno: number) {
    if(!this.filterFlag)
    {
      this.movieService.getMoviesCustomPage(pageno).subscribe({
        next: (data: any) => {
          this.movieResponse = data;
          this.pageMovies = this.movieResponse.movies;
          this.saveCurrentState() ;
        },
        error: (error) => {
          console.log(error);
          this.showErrorToast('error API custom movie page');
        },
        complete: () => console.log('completed'),
      });
    }
    else
    {
      //filter choice
      this.movieService.getCustomFilteredPage(pageno).subscribe({
        next: (fData: any) => {
          this.movieFilteredResponse = fData;
          this.filteredPageMovies = this.movieFilteredResponse.movies;
          this.saveCurrentState() ;
        },
        error: (error) => {
          console.log(error);
          this.showErrorToast('Error API Custom Filter Page');
          this.filterFlag = false ;
          this.saveCurrentState() ;
        },
        complete: () => console.log('completed'),
      });
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

  //fill object filter Values
  //genre
  fillGenreVal(genreName: any) {
    let genreCat = genreName.value;

    let genId = this.movieGenersIDGenerated[genreCat];

    this.filterMovieValuesObj.genreValue = genId;
    console.log(this.filterMovieValuesObj.genreValue);
  }

  //execute Filter
  executeFilter() {
    this.filterFlag = true ;
    this.currentFilteredPage = 1 ;
    this.movieService.getMovieFilterAll(this.filterMovieStatusObj,this.filterMovieValuesObj).subscribe({
      next: (fData: any) => {
        this.movieFilteredResponse = fData;
        this.filteredPageMovies = this.movieFilteredResponse.movies;
        this.totalFilteredPages = fData.totalPages;
        this.saveCurrentState() ;
      },
      error: (error) => {
        console.log(error);
        this.showErrorToast('error API movie Filter all first execution');
        this.saveCurrentState() ;
      },
      complete: () => console.log('completed'),
    });
  }

  //cancel filter => clear filter flag
  cancelFilter()
  {
    this.filterFlag = false ;
    this.saveCurrentState() ;
  }

  //using local storage to store state
  saveCurrentState() :void
  {
    sessionStorage.setItem('filterFlag',String(this.filterFlag)) ;
    sessionStorage.setItem('currentPage',String(this.currentPage)) ;
    sessionStorage.setItem('currentFilteredPage',String(this.currentFilteredPage)) ;
    sessionStorage.setItem('totalPages',String(this.totalPages)) ;
    sessionStorage.setItem('totalFilteredPages',String(this.totalFilteredPages)) ;
    sessionStorage.setItem('pageMovies',JSON.stringify(this.pageMovies)) ;
    sessionStorage.setItem('filteredPageMovies',JSON.stringify(this.filteredPageMovies)) ;
    sessionStorage.setItem('filterMovieStatusObj',JSON.stringify(this.filterMovieStatusObj)) ;
    sessionStorage.setItem('filterMovieValuesObj',JSON.stringify(this.filterMovieValuesObj)) ;
    sessionStorage.setItem('filteredURL',(this.movieService.filteredURL)) ;
  }

  restoreState()
  {
    this.filterFlag = sessionStorage.getItem('filterFlag') === 'true';
  this.currentPage = parseInt(sessionStorage.getItem('currentPage') ?? "1");
  this.totalPages = parseInt(sessionStorage.getItem('totalPages') ?? "201");
  this.currentFilteredPage = parseInt(sessionStorage.getItem('currentFilteredPage') ?? "1");
  this.totalFilteredPages = parseInt(sessionStorage.getItem('totalFilteredPages') ?? "30");
  this.pageMovies = JSON.parse(sessionStorage.getItem('pageMovies') ?? "[]");
  this.filteredPageMovies = JSON.parse(sessionStorage.getItem('filteredPageMovies') ?? "[]");
  this.filterMovieStatusObj = JSON.parse(sessionStorage.getItem('filterMovieStatusObj') ?? "{}") || {
    nameState: false,
    yearState: false,
    genreState: false,
    voteState: false,
    popularityState: false
  };
  this.filterMovieValuesObj = JSON.parse(sessionStorage.getItem('filterMovieValuesObj') ?? "{}") || {
    nameValue: "inception",
    yearValue: "2015",
    genreValue: 8,
    voteValue: 10,
    popularityValue: 55
  };
  this.movieService.filteredURL = sessionStorage.getItem('filteredURL') ?? "https://back-end-production-e1e1.up.railway.app/api";
  }

}
