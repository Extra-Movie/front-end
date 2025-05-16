import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

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
  ApexFill,
  ApexTooltip,
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
  tooltip: ApexTooltip | any;
};

@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './linechart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinechartComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  private _data: number[] = [];
  private _categories: string[] = [];
  private _title: string = '';

  // allows reactive updates without needing to track changes manually
  @Input() set data(value: number[]) {
    this._data = value;
    this.updateChart();
  }

  @Input() set categories(value: string[]) {
    this._categories = value;
    this.updateChart();
  }

  @Input() set title(value: string) {
    this._title = value;
    this.updateChart();
  }

  public chartOptions: Partial<ChartOptions> = {
    series: [{ name: 'Value', data: [] }],
    chart: {
      height: 240,
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
      text: '',
      align: 'left',
      style: {
        color: 'var(--color-primary)',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    grid: {
      borderColor: 'var(--color-base-300)',
      row: { colors: ['transparent', 'transparent'], opacity: 0.1 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: 'var(--color-base-content)' },
      },
      axisBorder: { color: 'var(--color-base-300)' },
      axisTicks: { color: 'var(--color-base-300)' },
    },
  };

  // ensure that the chart is updated after the view has been initialized
  ngAfterViewInit(): void {
    this.updateChart();
  }

  private updateChart(): void {
    if (this.chart) {
      //ApexCharts’ built-in methods to stop re-rendering all the chart optiona
      this.chart.updateSeries([{ name: 'Value', data: this._data }], true);
      this.chart.updateOptions({
        xaxis: { categories: this._categories },
        title: { text: this._title },
      });
    } else {
      this.chartOptions.series = [{ name: 'Value', data: this._data }];
      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: this._categories,
      };
      this.chartOptions.title = {
        ...this.chartOptions.title,
        text: this._title,
      };
    }
  }
}
