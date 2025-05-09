import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovieGenreType , MovieFilteredValuesType,MovieType,MovieResponseType } from '../../Types/Movie.types';
import {LoadingState} from '../../Types/loading-state.model';
import { catchError, map, startWith } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private myClinet: HttpClient) {}

  private readonly baseURL: string =
    'https://back-end-production-e1e1.up.railway.app/api/movies';

    public filteredURL! :string ;


  //page number to preview its content
  getAllMovies(pageNumber: number = 1 ,
    filterVals:MovieFilteredValuesType={nameValue:'',yearValue:'',genreValue:0,voteValue:0,popularityValue:0} ) :Observable<LoadingState<MovieResponseType>> {

      //page no
      let params = new HttpParams().set('page',pageNumber) ;
      //search
      if(filterVals.nameValue)
      {
        params = params.set('search',filterVals.nameValue) ;
      }
      //year
      if(filterVals.yearValue)
      {
        params = params.set('year',filterVals.yearValue) ;
      }
      //genre
      if(filterVals.genreValue)
      {
        params = params.set('genre',filterVals.genreValue) ;
      }
      //vote_average
      if(filterVals.voteValue)
      {
        params = params.set('vote_average',filterVals.voteValue) ;
      }
      //popularity
      if(filterVals.popularityValue)
      {
        params = params.set('popularity',filterVals.popularityValue) ;
      }


    return this.myClinet.get<any>(this.baseURL,{params}).pipe(
      map( response => {
        const data: MovieResponseType = response;
        console.log('Movies loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError(error => {
      console.error('error loading Movies:', error);
      return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }

  getMovieGeners() :Observable<any> {
    return  this.myClinet.get(`https://back-end-production-e1e1.up.railway.app/api/genres/movie`);
  }

  //need _id to be Passed >> string
  getMovieDetails(movie_id :string ) :Observable<any> {
    return  this.myClinet.get(`${this.baseURL}/${movie_id}`);
  }

  // {object contains status} , {object contain values}


  // getMovieFilterAll(filterStatus:MovieFilterStatusType ,filterVals : MovieFilteredValuesType ):Observable<any> {

  //   this.filteredURL = this.baseURL ;
  //   let previousFlag = false ;

  //   //check search first
  //   if(filterStatus.nameState)
  //   {
  //     this.filteredURL += `?search=${filterVals.nameValue}`;
  //     previousFlag = true ;
  //   }

  //   //year filter
  //   if(filterStatus.yearState)
  //   {
  //     if(previousFlag===true)
  //     {
  //       this.filteredURL += `&year=${filterVals.yearValue}`;
  //     }
  //     else
  //     {
  //       this.filteredURL += `?year=${filterVals.yearValue}`;
  //       previousFlag = true ;
  //     }

  //   }

  //   //genre filter
  //   if(filterStatus.genreState)
  //   {
  //     if(previousFlag===true)
  //     {
  //       this.filteredURL += `&genre=${filterVals.genreValue}`;
  //     }
  //     else
  //     {
  //       this.filteredURL += `?genre=${filterVals.genreValue}`;
  //       previousFlag = true ;
  //     }

  //   }

  //   //vote_average filter
  //   if(filterStatus.voteState)
  //   {
  //     if(previousFlag===true)
  //     {
  //       this.filteredURL += `&vote_average=${filterVals.voteValue}`;
  //     }
  //     else
  //     {
  //       this.filteredURL += `/movies?vote_average=${filterVals.voteValue}`;
  //       previousFlag = true ;
  //     }

  //   }

  //   //popularity filter
  //   if(filterStatus.popularityState)
  //   {
  //     if(previousFlag===true)
  //     {
  //       this.filteredURL += `&popularity=${filterVals.popularityValue}`;
  //     }
  //     else
  //     {
  //       this.filteredURL += `/movies?popularity=${filterVals.popularityValue}`;
  //       previousFlag = true ;
  //     }

  //   }

  //   console.log(this.filteredURL);

  //   return this.myClinet.get(this.filteredURL);
  // }

  // //get custom Filtered Page >> can't be called before calling getMovieFilterAll
  // getCustomFilteredPage(pageNo:number) :Observable<any>
  // {
  //   return this.myClinet.get(`${this.filteredURL}&page=${pageNo}`) ;
  // }

  //not tested yet
  //add new movie when user admin
  addMovie(movieData:MovieType) :Observable<any>
  {
    return this.myClinet.post(`${this.baseURL}/movies`,movieData) ;
  }

  //delete movie when user admin
  deleteMovie(movieId:string) :Observable<any>
  {
    return this.myClinet.delete(`${this.baseURL}/movies/${movieId}`) ;
  }

  // trending movies (10)
  // most watched movies (10)
  //Not Supported by API Yet

}
