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
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
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
  plotOptions: ApexPlotOptions | any;
};

@Component({
  selector: 'app-verbarchart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './verbarchart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbarchartComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  private _data: number[] = [];
  private _categories: string[] = [];
  private _title: string = '';

  @Input() set data(value: number[]) {
    this._data = value;
    this.updateChart();
  }

  @Input() set categories(value: string[]) {
    this._categories = value.map((item) => item.split(' ').slice(0, 2).join(' '));
    this.updateChart();
  }

  @Input() set title(value: string) {
    this._title = value;
    this.updateChart();
  }

  public chartOptions: Partial<ChartOptions> = {
    series: [{ name: 'Value', data: [] }],
    chart: {
      type: 'bar',
      height: 240,
      foreColor: 'var(--color-base-content)',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
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
      categories: [],
      labels: {
        style: { colors: 'var(--color-base-content)' },
      },
      axisBorder: { color: 'var(--color-base-300)' },
      axisTicks: { color: 'var(--color-base-300)' },
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--color-base-content)' },
      },
    },
    fill: {
      opacity: 1,
      colors: ['var(--color-primary)'],
    },
    legend: {
      labels: { colors: 'var(--color-base-content)' },
    },
    grid: {
      borderColor: 'var(--color-base-300)',
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
