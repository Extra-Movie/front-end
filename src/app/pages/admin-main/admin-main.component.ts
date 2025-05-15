import { Movie } from './../../Types/media.types';
import { MaindashboardService } from './../../services/maindashboard.service';
import {
  Component,
  effect,
  inject,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { PieComponent } from '../../components/maindashboardcharts/piechat/piechat.component';
import { LinechartComponent } from '../../components/maindashboardcharts/linechart/linechart.component';
import { AreachartComponent } from '../../components/maindashboardcharts/areachart/areachart.component';
import { BarchartComponent } from '../../components/maindashboardcharts/barchart/barchart.component';
import { KpiComponent } from '../../components/maindashboardcharts/kpi/kpi.component';
import { RequestState } from '../../services/apiRequest.service';
import { totalUsersType } from '../../Types/maindashboard.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-main',
  imports: [
    PieComponent,
    LinechartComponent,
    AreachartComponent,
    BarchartComponent,
    KpiComponent,
    CommonModule,
  ],
  templateUrl: './admin-main.component.html',
  styles: ``,
})
export class AdminMainComponent implements OnInit {
  private maindashboardService = inject(MaindashboardService);
  state: WritableSignal<RequestState<totalUsersType>>;
  totalusers: number = 0;
  totalSales: number = 0;
  totalRevenue: string = '';
  cartFrequency: number = 0;

  userByRoleChartData: {
    series: number[];
    labels: string[];
  } = {
    series: [],
    labels: [],
  };

  userGrowthChartData: {
    data: number[];
    categories: string[];
  } = {
    data: [],
    categories: [],
  };

  monthlySalesTrendChartData: {
    data: number[];
    categories: string[];
  } = {
    data: [],
    categories: [],
  };

  movieChartData: {
    data: number[];
    categories: string[];
  } = {
    data: [],
    categories: [],
  };

  tvShowChartData: {
    data: number[];
    categories: string[];
  } = {
    data: [],
    categories: [],
  };

  constructor() {
    this.state = this.maindashboardService.totalUsersState.state;
  }

  ngOnInit(): void {
    this.getTotalUsers();
    this.getTotalSales();
    this.getTotalRevenue();
    this.getCartFrequency();
    this.getUsersByRole();
    this.getUserGrowth();
    this.getMonthlySalesTrend();
    this.getTopSellingContent();
  }

  getTotalUsers() {
    this.maindashboardService.getTotalUsers().subscribe({
      next: (res) => {
        if (res) {
          this.totalusers = res.totalUsers;
        }
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
  }

  getTotalSales() {
    this.maindashboardService.getTotalSales().subscribe({
      next: (res) => {
        if (res) {
          this.totalSales = res.totalTransactions;
        }
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
  }
  getTotalRevenue() {
    this.maindashboardService.getTotalRevenue().subscribe({
      next: (res) => {
        if (res) {
          this.totalRevenue = res.totalRevenue.toString();
        }
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
  }

  getCartFrequency() {
    this.maindashboardService.getCartFrequency().subscribe({
      next: (res) => {
        if (res) {
          this.cartFrequency = res.totalUsers;
        }
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
  }

  getUsersByRole() {
    this.maindashboardService.getUsersByRole().subscribe({
      next: (res) => {
        if (res) {
          const ff = res.map((item) => item.totalCount);
          this.userByRoleChartData.series = ff.map((item) => Number(item));
          const labels = res.map((item) => item.role);
          this.userByRoleChartData.labels = labels.map((item) => item);
        }
      },
      error: (err) => {
        console.error('Error loading total users:', err);
      },
    });
  }

  getUserGrowth() {
    this.maindashboardService.getUserGrowth().subscribe({
      next: (res) => {
        if (res) {
          const dummy = [
            { totalCount: 10, month: 'January' },
            { totalCount: 20, month: 'February' },
            { totalCount: 25, month: 'March' },
            { totalCount: 30, month: 'April' },
            { totalCount: 45, month: 'May' },
          ];
          const combined = [...dummy, ...res];
          this.userGrowthChartData.data = combined.map(
            (item) => item.totalCount
          );
          this.userGrowthChartData.categories = combined.map(
            (item) => item.month
          );
        }
      },
      error: (err) => {
        console.error('Error loading user growth:', err);
      },
    });
  }
  getMonthlySalesTrend() {
    this.maindashboardService.getMonthlySalesTrend().subscribe({
      next: (res) => {
        if (res) {
          const dummy = [
            { totalSales: 5000, month: 'January' },
            { totalSales: 7000, month: 'February' },
            { totalSales: 8000, month: 'March' },
            { totalSales: 7500, month: 'April' },
            { totalSales: 9000, month: 'May' },
          ];
          const combined = [...dummy, ...res];
          this.monthlySalesTrendChartData.data = combined.map(
            (item) => item.totalSales
          );
          this.monthlySalesTrendChartData.categories = combined.map(
            (item) => item.month
          );
        }
      },
      error: (err) => {
        console.error('Error loading monthly sales trend:', err);
      },
    });
  }

  getTopSellingContent() {
    this.maindashboardService.getTopSellingContent().subscribe({
      next: (res) => {
        if (res) {
          console.log(res);
        }
      },
      error: (err) => {
        console.error('Error loading top selling content:', err);
      },
    });
  }
}
