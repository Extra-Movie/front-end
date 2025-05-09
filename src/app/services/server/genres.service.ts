
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError, map, startWith ,tap} from 'rxjs/operators';
import { LoadingState } from '../../Types/loading-state.model';

import { Genre } from '../../Types/genres.types';


@Injectable({
  providedIn: 'root'
})


export class GenresService {
  moviesGenres: Genre[] = [];
  seriesGenres: Genre[] = [];
  
  private URLMovies = 'https://back-end-production-e1e1.up.railway.app/api/genres/movie';
  private URLSeries = 'https://back-end-production-e1e1.up.railway.app/api/genres/tvshow';

  constructor(private http: HttpClient) {}

  getMovieGenres(): Observable<LoadingState<Genre[]>> {
    return this.http.get<Genre[]>(this.URLMovies).pipe(
      map(response=>{
        const data: Genre[] = response;
        this.moviesGenres = data;
        console.log('genres loaded now:', data);
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
        console.log('genres loaded now:', data);
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
