import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
  title: any;
};

@Component({
  selector: 'pie-app',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './piechat.component.html',
})
export class PieComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() title: string = '';

  constructor() {
    this.chartOptions = {
      series: this.series,
      chart: {
        height: 240,
        type: 'pie',
        foreColor: 'var(--color-base-content)',
      },
      title: {
        text: this.title,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'var(--color-primary)',
        },
      },
      labels: this.labels,
      fill: {
        colors: [
          'var(--color-primary)',
          'var(--color-secondary)',
          'var(--color-accent)',
        ],
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.chartOptions.series = changes['series'].currentValue;
      this.chartOptions.labels = changes['labels'].currentValue;
      this.chartOptions.title.text = changes['title'].currentValue;
    }
  }
}
