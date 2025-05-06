import { Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Injectable, signal } from '@angular/core';

export interface RequestState<T> {
  loading: boolean;
  success: boolean;
  error: string | null;
  data: T | null;
}

@Injectable({ providedIn: 'root' })
export class RequestStateService<T> {
  private initialState: RequestState<T> = {
    loading: false,
    success: false,
    error: null,
    data: null,
  };

  state = signal<RequestState<T>>(this.initialState);

  track(observable: Observable<T>): Observable<T | null> {
    this.state.set({
      loading: true,
      success: false,
      error: null,
      data: null,
    });
    return observable.pipe(
      tap(
        (data) =>
          this.state.update((prev) => ({ ...prev, data, success: true })) // Update the data and success state
      ),
      catchError((error) => {
        console.error('Error occurred:', error); // Log the error to the console
        this.state.update((prev) => ({
          ...prev,
          error: error.error.message,
          success: false,
        })); // Update the error state
        return of(null);
      }),
      finalize(
        () => this.state.update((prev) => ({ ...prev, loading: false })) // Set loading to false after the observable completes
      )
    );
  }

  reset() {
    this.state.set(this.initialState);
  }
}
