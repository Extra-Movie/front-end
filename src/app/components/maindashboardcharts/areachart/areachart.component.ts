import { Component, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  yaxis: ApexYAxis | any;
  title: ApexTitleSubtitle | any;
  labels: string[] | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-areachart',
  imports: [NgApexchartsModule],
  templateUrl: './areachart.component.html',
  styles: ``,
})
export class AreachartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'STOCK ABC',
          data: [100, 55, 13, 43, 22],
        },
      ],
      chart: {
        type: 'area',
        height: 220,
        foreColor: 'var(--color-base-content)',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        colors: ['var(--color-primary)'],
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
        colors: ['var(--color-primary)'],
      },
      title: {
        text: 'Fundamental Analysis of Stocks',
        align: 'left',
        style: {
          color: 'var(--color-primary)',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },

      labels: [
        '2023-01-01',
        '2023-02-01',
        '2023-03-01',
        '2023-04-01',
        '2023-05-01',
      ],
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
        type: 'datetime',
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
      yaxis: {
        opposite: true,
        labels: {
          style: {
            colors: 'var(--color-base-content)',
          },
        },
      },
      legend: {
        horizontalAlign: 'right',
        labels: {
          colors: 'var(--color-base-content)',
        },
      },
    };
  }
}
