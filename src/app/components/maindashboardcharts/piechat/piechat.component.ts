import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: string[] | any;
  fill: ApexFill | any;
  title: ApexTitleSubtitle | any;
};

@Component({
  selector: 'pie-app',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './piechat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  private _series: number[] = [];
  private _labels: string[] = [];
  private _title: string = '';

  @Input() set series(value: number[]) {
    this._series = value;
    this.updateChart();
  }

  @Input() set labels(value: string[]) {
    this._labels = value;
    this.updateChart();
  }

  @Input() set title(value: string) {
    this._title = value;
    this.updateChart();
  }

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'pie',
      height: 240,
      foreColor: 'var(--color-base-content)',
    },
    labels: [],
    fill: {
      colors: [
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-accent)',
      ],
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'var(--color-primary)',
      },
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 1021,
        options: {
          legend: {
            position: 'right',
          },
        },
      },
    ],
  };

  ngAfterViewInit(): void {
    this.updateChart();
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.updateSeries(this._series, true);
      this.chart.updateOptions({
        labels: this._labels,
        title: { text: this._title },
      });
    } else {
      this.chartOptions.series = this._series;
      this.chartOptions.labels = this._labels;
      this.chartOptions.title = {
        ...this.chartOptions.title,
        text: this._title,
      };
    }
  }
}
