import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  MovieFilteredValuesType,
  MovieResponseType,
} from '../../Types/Movie.types';
import { LoadingState } from '../../Types/loading-state.model';
import { catchError, map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private myClinet: HttpClient) {}

  private readonly baseURL: string = environment.apiUrl + '/movies';

  public filteredURL!: string;

  //page number to preview its content
  getAllMovies(
    pageNumber: number = 1,
    filterVals: MovieFilteredValuesType = {
      nameValue: '',
      yearValue: '',
      genreValue: 0,
      voteValue: 0,
      popularityValue: 0,
    }
  ): Observable<LoadingState<MovieResponseType>> {
    //page no
    let params = new HttpParams().set('page', pageNumber);
    //search
    if (filterVals.nameValue) {
      params = params.set('search', filterVals.nameValue);
    }
    //year
    if (filterVals.yearValue) {
      params = params.set('year', filterVals.yearValue);
    }
    //genre
    if (filterVals.genreValue) {
      params = params.set('genre', filterVals.genreValue);
    }
    //vote_average
    if (filterVals.voteValue) {
      params = params.set('vote_average', filterVals.voteValue);
    }
    //popularity
    if (filterVals.popularityValue) {
      params = params.set('popularity', filterVals.popularityValue);
    }

    return this.myClinet.get<any>(this.baseURL, { params }).pipe(
      map((response) => {
        const data: MovieResponseType = response;
        console.log('Movies loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError((error) => {
        console.error('error loading Movies:', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }

  getMovieGeners(): Observable<any> {
    return this.myClinet.get(
      `https://back-end-production-e1e1.up.railway.app/api/genres/movie`
    );
  }

  //need _id to be Passed >> string
  getMovieDetails(movie_id: string): Observable<any> {
    return this.myClinet.get(`${this.baseURL}/${movie_id}`);
  }

  //delete movie when user admin
  deleteMovie(movieId: string): Observable<any> {
    return this.myClinet.delete(`${this.baseURL}/${movieId}`).pipe(
      map((response) => {
        const data: any = response;
        console.log('Movies deleted now:', data);
        return { state: 'success', data } as const;
      }),
      catchError((error) => {
        console.error('error loading Movies:', error);
        return of({ state: 'error', error } as const);
      })
    );
  }

  //not tested yet
  //add new movie when user admin

  addMovie(movieData: FormData): Observable<any> {
    return this.myClinet.post(`${this.baseURL}`, movieData).pipe(
      catchError((error) => {
        console.error('Error add series:', error);
        return of({ state: 'error', error } as const);
      })
    );
  }

  // trending movies (10)
  // most watched movies (10)
  //Not Supported by API Yet
}
