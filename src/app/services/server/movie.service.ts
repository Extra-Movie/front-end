import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovieGenreType , MovieFilteredValuesType,MovieType,MovieFilterStatusType } from '../../Types/Movie.types';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private myClinet: HttpClient) {}

  private readonly baseURL: string =
    'https://back-end-production-e1e1.up.railway.app/api';

    public filteredURL! :string ;


  //page number to preview its content
  getMoviesCustomPage(pagenumber: number = 1) :Observable<any> {
    return this.myClinet.get(`${this.baseURL}/movies?page=${pagenumber}`);
  }

  getMovieGeners() :Observable<any> {
    return  this.myClinet.get(`${this.baseURL}/genres/movie`);
  }

  //need _id to be Passed >> string
  getMovieDetails(movie_id :string ) :Observable<any> {
    return  this.myClinet.get(`${this.baseURL}/movies/${movie_id}`);
  }

  // {object contains status} , {object contain values}
  // getMovieFilterAll(filterStatus:MovieFilterStatusType ,filterVals : MovieFilteredValuesType ):void {

  getMovieFilterAll(filterStatus:MovieFilterStatusType ,filterVals : MovieFilteredValuesType ):Observable<any> {

    this.filteredURL = this.baseURL ;
    let previousFlag = false ;

    //check search first
    if(filterStatus.nameState)
    {
      this.filteredURL += `/movies?search=${filterVals.nameValue}`;
      previousFlag = true ;
    }

    //year filter
    if(filterStatus.yearState)
    {
      if(previousFlag===true)
      {
        this.filteredURL += `&year=${filterVals.yearValue}`;
      }
      else
      {
        this.filteredURL += `/movies?year=${filterVals.yearValue}`;
        previousFlag = true ;
      }

    }

    //genre filter
    if(filterStatus.genreState)
    {
      if(previousFlag===true)
      {
        this.filteredURL += `&genre=${filterVals.genreValue}`;
      }
      else
      {
        this.filteredURL += `/movies?genre=${filterVals.genreValue}`;
        previousFlag = true ;
      }

    }

    //vote_average filter
    if(filterStatus.voteState)
    {
      if(previousFlag===true)
      {
        this.filteredURL += `&vote_average=${filterVals.voteValue}`;
      }
      else
      {
        this.filteredURL += `/movies?vote_average=${filterVals.voteValue}`;
        previousFlag = true ;
      }

    }

    //popularity filter
    if(filterStatus.popularityState)
    {
      if(previousFlag===true)
      {
        this.filteredURL += `&popularity=${filterVals.popularityValue}`;
      }
      else
      {
        this.filteredURL += `/movies?popularity=${filterVals.popularityValue}`;
        previousFlag = true ;
      }

    }

    console.log(this.filteredURL);

    return this.myClinet.get(this.filteredURL);
  }

  //get custom Filtered Page >> can't be called before calling getMovieFilterAll
  getCustomFilteredPage(pageNo:number) :Observable<any>
  {
    return this.myClinet.get(`${this.filteredURL}&page=${pageNo}`) ;
  }

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
