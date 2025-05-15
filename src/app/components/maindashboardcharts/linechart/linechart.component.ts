import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

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
  tooltip: ApexTooltip | any;
};

@Component({
  selector: 'app-linechart',
  imports: [NgApexchartsModule],
  templateUrl: './linechart.component.html',
  styles: ``,
})
export class LinechartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = '';

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Desktops',
          data: [2053, ...this.data],
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
        text: this.title,
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
        categories: ['Jun', ...this.categories],
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['categories'] || changes['title']) {
      this.chartOptions.series = [
        {
          name: 'Value',
          data: changes['data'].currentValue,
        },
      ];
      this.chartOptions.xaxis.categories = changes['categories'].currentValue;
      this.chartOptions.title.text = changes['title'].currentValue;
    }
  }
}
