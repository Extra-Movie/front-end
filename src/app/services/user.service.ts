import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestStateService } from './apiRequest.service';
import { tap } from 'rxjs';
import { registeredUser } from '../Types/Authentication.types';
import {
  userData,
  userLists,
  userListsResponse,
  userResponse,
} from '../Types/User.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authUrl = environment.apiUrl + '/user';
  private _token = signal<string | null>(
    localStorage.getItem('token') || sessionStorage.getItem('token') || null
  );
  readonly token = this._token.asReadonly();

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token()}`,
  });

  delState = new RequestStateService<userResponse>();
  updateState = new RequestStateService<registeredUser>();
  userState = new RequestStateService<userData>();
  usersState = new RequestStateService<userData[]>();
  userListState = new RequestStateService<userListsResponse>();

  getUser(id: string) {
    const req$ = this.http.get<userData>(`${this.authUrl}/${id}`, {
      headers: this.headers,
    });
    return this.userState.track(req$);
  }

  getAllUsers() {
    const req$ = this.http.get<userData[]>(this.authUrl, {
      headers: this.headers,
    });
    return this.usersState.track(req$);
  }

  deletUser(id: string) {
    const req$ = this.http.delete<userResponse>(`${this.authUrl}/${id}`, {
      headers: this.headers,
    });
    return this.delState.track(req$).pipe(
      tap((res) => {
        if (res) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      })
    );
  }

  updateUser(id: string, user: registeredUser) {
    const req$ = this.http.put<registeredUser>(`${this.authUrl}/${id}`, user, {
      headers: this.headers,
    });
    return this.updateState.track(req$);
  }

  makeAdmin(id: string) {
    const req$ = this.http.patch<userResponse>(`${this.authUrl}/${id}`, {
      headers: this.headers,
    });
    return this.delState.track(req$);
  }

  addToOwned(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/addOwned`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  addToWatchlist(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/watchlist`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  addToCart(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/addToCart`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  removeFromOwned(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/removeOwned`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  removeFromWatchlist(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/removeWatchlist`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  removeFromCart(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/removeCart`,
      movie,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }

  getOwned() {
    const req$ = this.http.get<userListsResponse>(`${this.authUrl}/getOwned`, {
      headers: this.headers,
    });
    return this.userListState.track(req$);
  }
  getWatchlist() {
    const req$ = this.http.get<userListsResponse>(
      `${this.authUrl}/getWatchlist`,
      {
        headers: this.headers,
      }
    );
    return this.userListState.track(req$);
  }
  getCart() {
    const req$ = this.http.get<userListsResponse>(`${this.authUrl}/getCart`, {
      headers: this.headers,
    });
    return this.userListState.track(req$);
  }

}
