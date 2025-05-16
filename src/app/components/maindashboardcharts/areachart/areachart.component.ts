import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';

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
  ApexFill,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  dataLabels: ApexDataLabels | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
  grid: ApexGrid | any;
  labels: any;
};

@Component({
  selector: 'app-areachart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './areachart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreachartComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  private _data: number[] = [];
  private _categories: string[] = [];
  private _title: string = '';

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
      type: 'area',
      height: 240,
      foreColor: 'var(--color-base-content)',
      zoom: { enabled: false },
      toolbar: { show: false },
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
      text: '',
      align: 'left',
      style: {
        color: 'var(--color-primary)',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        style: { colors: 'var(--color-base-content)' },
      },
      axisBorder: { color: 'var(--color-base-300)' },
      axisTicks: { color: 'var(--color-base-300)' },
    },
    yaxis: {
      opposite: true,
      labels: {
        style: { colors: 'var(--color-base-content)' },
      },
    },
    legend: {
      horizontalAlign: 'right',
      labels: { colors: 'var(--color-base-content)' },
    },
    grid: {
      borderColor: 'var(--color-base-300)',
      row: { colors: ['transparent', 'transparent'], opacity: 0.1 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
  };

  ngAfterViewInit(): void {
    this.updateChart();
  }

  private updateChart(): void {
    if (this.chart) {
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
