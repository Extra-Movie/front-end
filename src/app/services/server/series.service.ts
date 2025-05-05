import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { LoadingState } from '../../Types/loading-state.model';
import { Series } from '../../Types/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private URL = 'https://back-end-production-e1e1.up.railway.app/api/tvshows';

  constructor(private http: HttpClient) { }

    getAllSeries(page: number = 1, search: string = '',year:string='',popularity:number=0,vote_average:number=0): Observable<LoadingState<Series[]>>{

    let params = new HttpParams().set('page', page.toString());
    if (search){
      params = params.set('search', search);
    }
    //  `${year}-04-28`
    if (year){
      params = params.set('year', year);
    }
    if (popularity){
      params = params.set('popularity', popularity.toString());
    }
    if (vote_average){
      params = params.set('vote_average', vote_average.toString());
    }

    return this.http.get<any>(this.URL, { params}).pipe(
      map(response => {
        const data: Series[] = response.tvShows;
        console.log('series loaded now:', data);
        return { state: 'loaded', data } as const;
      }),
      catchError(error => {
        console.error('error loading series:', error);
        return of({ state: 'error', error } as const);
      }),
      startWith({ state: 'loading' } as const)
    );
  }
  getSeriesById(_id: string) {
    const url = `${this.URL}/${_id}`;
    return this.http.get<Series>(url).pipe(
      catchError(error => {
        console.error('Error loading series by Id:', error);
        return of({ state: 'error', error } as const);
      })
    );
  }
  deleteSeriesById(_id:string){
    let url=`${this.URL}/${_id}`;
    return this.http.delete<Series>(url).pipe(
     catchError(error => {
       console.error('Error delete series by Id:', error);
       return of({ state: 'error', error } as const);
     })
    )
 }
 addSeries(series: Series): Observable<any> {
  return this.http.post(this.URL, series ).pipe(
    catchError(error => {
      console.error('Error add series:', error);
      return of({ state: 'error', error } as const);
    })
  );
}


  topWatchedSeries(seriesList:Series[],n:number=10) :Series[]{
      return [...seriesList]
      .sort((a,b)=> b.number_of_purchases -a.number_of_purchases)
      .slice(0,n);
  }
  topTrendingSeries(seriesList:Series[],n:number=10) :Series[]{
    return [...seriesList]
    .sort((a,b)=> b.popularity -a.popularity)
    .slice(0,n);
}
}




//resource of state to understand pip => https://dev.to/rensjaspers/angular-guide-for-beginners-fetching-data-from-an-api-with-loading-spinner-implementation-120l


//before omer update with token
// const reqHeader = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTYzYTg4OTA1OTFiNDcwYzlkOTExNiIsIm5hbWUiOiJnaGFkYSIsImVtYWlsIjoiZ2hhZGFAZ21haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTc0NjI4NzI4NiwiZXhwIjoxNzQ2NTQ2NDg2fQ.hZE-J0hdHZ0A6y8kp58DrvZ-q2QA1YdiqMyccDG54_w'
    // });
    // , headers: reqHeader
