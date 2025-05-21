import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { LoadingState } from '../../Types/loading-state.model';
import {
  Series,
  SeriesResponseType,
  SeriesFilteredValuesType,
} from '../../Types/series.model';
import { environment } from '../../../environments/environment';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private URL = environment.apiUrl + '/tvshows';
  private reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private userService: UserService) {}

  getAllSeries(
    page: number = 1,
    filterVal: SeriesFilteredValuesType
  ): Observable<LoadingState<SeriesResponseType>> {
    let params = new HttpParams().set('page', page);
    //search
    if (filterVal.nameValue) {
      params = params.set('search', filterVal.nameValue);
    }
    //  `${year}-04-28`
    if (filterVal.yearValue) {
      params = params.set('year', filterVal.yearValue);
    }
    if (filterVal.popularityValue) {
      params = params.set('popularity', filterVal.popularityValue);
    }
    if (filterVal.voteValue) {
      params = params.set('vote_average', filterVal.voteValue);
    }
    if (filterVal.genreValue) {
      params = params.set('genre', filterVal.genreValue);
    }

    return this.http.get<any>(this.URL, { params }).pipe(
      map((response) => {
        const data: SeriesResponseType = response;
        console.log('series loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError((error) => {
        console.error('error loading series:', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }
  getSeriesById(_id: string): Observable<LoadingState<any>> {
    const url = `${this.URL}/${_id}`;
    return this.http.get(url).pipe(
      map((response) => {
        const data: any = response;
        console.log('One Series loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError((error) => {
        console.error('error loading Series', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }
  deleteSeriesById(_id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userService.token()}`,
    });
    let url = `${this.URL}/${_id}`;
    return this.http.delete<Series>(url, { headers }).pipe(
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
  addSeries(series: FormData): Observable<any> {
    return this.http.post(this.URL, series, { headers: this.reqHeader }).pipe(
      catchError((error) => {
        console.error('Error add series:', error);
        return of({ state: 'error', error } as const);
      })
    );
  }
  // addSeries(series: FormData): Observable<any> {
  // const headers = new HttpHeaders();
  // return this.http.post(this.URL, series, { headers }).pipe(
  //   catchError(error => {
  //     console.error('Error adding series:', error);
  //     return of({ state: 'error', error } as const);
  //   })
  // );
  //}

  topWatchedSeries(seriesList: Series[], n: number = 10): Series[] {
    return [...seriesList]
      .sort((a, b) => b.number_of_purchases - a.number_of_purchases)
      .slice(0, n);
  }
  topTrendingSeries(seriesList: Series[], n: number = 10): Series[] {
    return [...seriesList]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, n);
  }
}
