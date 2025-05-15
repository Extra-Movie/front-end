import { Component, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  grid: ApexGrid | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  fill: ApexFill | any;
};

@Component({
  selector: 'app-linechart',
  imports: [NgApexchartsModule],
  templateUrl: './linechart.component.html',
  styles: ``,
})
export class LinechartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 220,
        foreColor: 'var(--color-base-content)',
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['var(--color-primary-content)'],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['var(--color-primary)'],
      },
      fill: {
        type: 'gradient',
        colors: ['var(--color-primary)'],
        gradient: {
          shade: 'light',
          type: 'vertical',
          gradientToColors: ['var(--color-secondary)'],
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left',
        style: {
          color: 'var(--color-primary)',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      grid: {
        borderColor: 'var(--color-base-300)',
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.1,
        },
        xaxis: {
          lines: { show: false },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
        labels: {
          style: {
            colors: 'var(--color-base-content)',
          },
        },
        axisBorder: {
          color: 'var(--color-base-300)',
        },
        axisTicks: {
          color: 'var(--color-base-300)',
        },
      },
    };
  }
}
