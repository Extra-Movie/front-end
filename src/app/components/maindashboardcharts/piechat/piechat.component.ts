import { Component, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  fill: any;
};

@Component({
  selector: 'pie-app',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './piechat.component.html',
})
export class PieComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [100, 55, 13],
      chart: {
        height: 240,
        type: 'pie',
        foreColor: 'var(--color-base-content)',
      },
      labels: ['Team A', 'Team B', 'Team C'],
      fill: {
        colors: [
          'var(--color-primary)',
          'var(--color-secondary)',
          'var(--color-accent)',
        ],
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
              labels: {
                colors: ['var(--color-base-content)'],
              },
            },
          },
        },
      ],
    };
  }
}
