import {
  totalSalesType,
  totalRevenueType,
  cartFrequencyType,
  usersByRoleType,
  userGrowthType,
  monthlySalesTrendType,
  topSellingContentResponseType,
} from './../Types/maindashboard.types';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestStateService } from './apiRequest.service';
import { totalUsersType } from '../Types/maindashboard.types';

@Injectable({
  providedIn: 'root',
})
export class MaindashboardService {
  private http = inject(HttpClient);
  private authUrl = environment.apiUrl + '/dashboard';
  totalUsersState = new RequestStateService<totalUsersType>();
  totalSalesState = new RequestStateService<totalSalesType>();
  totalRevenueState = new RequestStateService<totalRevenueType>();
  cartFrequencyState = new RequestStateService<cartFrequencyType>();
  usersByRoleState = new RequestStateService<usersByRoleType>();
  usersGrowthState = new RequestStateService<userGrowthType>();
  monthlySalesTrendState = new RequestStateService<monthlySalesTrendType>();
  topSellingContentState =
    new RequestStateService<topSellingContentResponseType>();

  getTotalUsers() {
    const req$ = this.http.get<totalUsersType>(`${this.authUrl}/total-users`);
    return this.totalUsersState.track(req$);
  }

  getTotalSales() {
    const req$ = this.http.get<totalSalesType>(`${this.authUrl}/total-sales`);
    return this.totalSalesState.track(req$);
  }

  getTotalRevenue() {
    const req$ = this.http.get<totalRevenueType>(
      `${this.authUrl}/total-revenue`
    );
    return this.totalRevenueState.track(req$);
  }

  getCartFrequency() {
    const req$ = this.http.get<cartFrequencyType>(
      `${this.authUrl}/cart-frequency`
    );
    return this.cartFrequencyState.track(req$);
  }

  getUsersByRole() {
    const req$ = this.http.get<usersByRoleType>(
      `${this.authUrl}/users-by-role`
    );
    return this.usersByRoleState.track(req$);
  }

  getUserGrowth() {
    const req$ = this.http.get<userGrowthType>(`${this.authUrl}/user-growth`);
    return this.usersGrowthState.track(req$);
  }

  getMonthlySalesTrend() {
    const req$ = this.http.get<monthlySalesTrendType>(
      `${this.authUrl}/monthly-sales-trend`
    );
    return this.monthlySalesTrendState.track(req$);
  }

  getTopSellingContent() {
    const req$ = this.http.get<topSellingContentResponseType>(
      `${this.authUrl}/top-selling-content`
    );
    return this.topSellingContentState.track(req$);
  }
}
