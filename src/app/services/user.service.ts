import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestStateService } from './apiRequest.service';
import { registeredUser } from '../Types/Authentication.types';
import {
  CartResponse,
  OwnedResponse,
  WatchListResponse,
  userData,
  userLists,
  userListsResponse,
  userResponse,
} from '../Types/User.types';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authUrl = environment.apiUrl + '/users';
  private _token = signal<string | null>(
    localStorage.getItem('token') || sessionStorage.getItem('token') || null
  );
  readonly token = this._token.asReadonly();
  private _user = signal<userData | null>(null);
  readonly user = this._user.asReadonly();

  delState = new RequestStateService<userResponse>();
  updateState = new RequestStateService<registeredUser>();
  userState = new RequestStateService<userData>();
  usersState = new RequestStateService<userData[]>();
  userListState = new RequestStateService<userListsResponse>();
  cartState = new RequestStateService<CartResponse>();
  watchListState = new RequestStateService<WatchListResponse>();
  ownedState = new RequestStateService<OwnedResponse>();

  getMyData() {
    const userState = new RequestStateService<{ userData: userData }>();
    const req$ = this.http.get<{ userData: userData }>(
      `${this.authUrl}/getuser`
    );
    return userState.track(req$).pipe(
      tap((res) => {
        console.log('🚀 ~ UserService ~ tap ~ res:', res);
        if (res) this._user.set(res?.userData);
        else this._user.set(null);
      })
    );
  }

  getUser(id: string) {
    const req$ = this.http.get<userData>(`${this.authUrl}/${id}`);
    return this.userState.track(req$);
  }

  getAllUsers() {
    const req$ = this.http.get<{ usersData: userData[] }>(this.authUrl)
     .pipe(map(response => response.usersData));
    return req$;
  }

  deletUser(id: string) {
    const req$ = this.http.delete<userResponse>(`${this.authUrl}/${id}`);
    return this.delState.track(req$);
  }

  updateUser(id: string, user: registeredUser) {
    const req$ = this.http.put<registeredUser>(`${this.authUrl}/${id}`, user);
    return this.updateState.track(req$);
  }

  makeAdmin(id: string) {
    const req$ = this.http.patch<userData>(`${this.authUrl}/${id}`,{});
    return this.userState.track(req$).pipe(
      tap((res)=>{
        if(res){
          console.log("service",res);
          res.isAdmin=true;
        }
      })
    )
  }

  addToWatchlist(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/watchlist`,
      movie
    );
    return this.userListState.track(req$);
  }

  addToCart(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/addToCart`,
      movie
    );
    return this.userListState.track(req$);
  }

  removeFromWatchlist(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/removeWatchlist`,
      movie
    );
    return this.userListState.track(req$);
  }

  removeFromCart(movie: userLists) {
    const req$ = this.http.post<userListsResponse>(
      `${this.authUrl}/removeCart`,
      movie
    );
    return this.userListState.track(req$);
  }

  getOwned() {
    const req$ = this.http.get<OwnedResponse>(`${this.authUrl}/getOwned`);
    return this.ownedState.track(req$);
  }
  getWatchlist() {
    const req$ = this.http.get<WatchListResponse>(
      `${this.authUrl}/getWatchlist`
    );
    return this.watchListState.track(req$);
  }
  getCart() {
    const req$ = this.http.get<CartResponse>(`${this.authUrl}/getCart`);
    return this.cartState.track(req$);
  }
}
