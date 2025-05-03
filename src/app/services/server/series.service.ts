import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { LoadingState } from '../../Types/loading-state.model';
import { Series } from '../../Types/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private URL='https://back-end-production-e1e1.up.railway.app/api/tvshows';
  constructor(private http:HttpClient) { }

  //get all Series  using pagnation ,filter (search)
  getAllSeries(page: number = 1, search: string = ''): Observable<LoadingState<Series[]>>{
         let params = new HttpParams().set('page', page);
         if (search) params = params.set('search', search);
         return this.http.get<Series[]>(this.URL, { params }).pipe(
          map(data => ({ state: 'loaded', data } as const)),
          catchError(error => of({ state: 'error', error } as const)),
          startWith({ state: 'loading' } as const)
        );
      }
 }
