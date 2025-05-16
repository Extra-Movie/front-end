
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError, map, startWith ,tap} from 'rxjs/operators';
import { LoadingState } from '../../Types/loading-state.model';

import { Genre } from '../../Types/genres.types';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class GenresService {
  moviesGenres: Genre[] = [];
  seriesGenres: Genre[] = [];

  private URLMovies = environment.apiUrl + '/genres/movie';
  private URLSeries = environment.apiUrl + '/genres/tv';

  constructor(private http: HttpClient) {}

  getMovieGenres(): Observable<LoadingState<Genre[]>> {
    return this.http.get<Genre[]>(this.URLMovies).pipe(
      map(response=>{
        const data: Genre[] = response;
        this.moviesGenres = data;
        console.log('Movie genres loaded now:', data);
        return { state: 'loaded',data } as const;
      }),
      catchError(error => {
        console.error('error loading genres:', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }



  getSeriesGenres(): Observable<LoadingState<Genre[]>> {
    return this.http.get<Genre[]>(this.URLSeries).pipe(
      map(response=>{
        const data: Genre[] = response;
        console.log('Series genres loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError(error => {
        console.error('error loading genres:', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }



}
