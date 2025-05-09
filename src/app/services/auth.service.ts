import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  loginResponse,
  loginUser,
  registeredUser,
  registerResponse,
} from '../Types/Authentication.types';
import { RequestStateService } from './apiRequest.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = environment.apiUrl + '/auth'; // URL to web api
  private _token = signal<string | null>(
    localStorage.getItem('token') || sessionStorage.getItem('token') || null
  );
  readonly token = this._token.asReadonly();

  isLoggedIn = computed(() => !this.token());

  //#region
  loginState = new RequestStateService<loginResponse>();
  registerState = new RequestStateService<registerResponse>();
  //#endregion

  //#region Token Management
  private setToken(token: string, rememberMe: boolean) {
    this._token.set(token);
    if (rememberMe) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  }
  private removeToken() {
    this._token.set(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
  //#endregion

  login({ email, password, rememberMe }: loginUser) {
    //* Check if the user is already logged in
    if (this.isLoggedIn()) {
      this.removeToken(); // Remove the existing token
    }

    //* Make the login request
    const req$ = this.http.post<loginResponse>(`${this.authUrl}/login`, {
      email,
      password,
    });
    return this.loginState.track(req$).pipe(
      tap((res) => {
        if (res) {
          this.setToken(res.token, rememberMe ?? false);
        } else {
          this.removeToken();
        }
        return res;
      })
    );
  }

  register({ name, email, password }: registeredUser) {
    // Check if the user is already logged in
    if (this.isLoggedIn()) {
      this.removeToken(); // Remove the existing token
    }
    const req$ = this.http.post<registerResponse>(`${this.authUrl}/register`, {
      name,
      email,
      password,
    });
    return this.registerState.track(req$);
  }

  logout() {
    this.removeToken();
    this.loginState.reset();
    this.registerState.reset();
  }
}
