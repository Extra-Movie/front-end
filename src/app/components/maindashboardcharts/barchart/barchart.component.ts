import {
  Component,
  ViewChild,
  SimpleChanges,
  OnChanges,
  Input,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  title: ApexTitleSubtitle | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-barchart',
  imports: [NgApexchartsModule],
  templateUrl: './barchart.component.html',
  styles: ``,
})
export class BarchartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = '';
  @Input() horizontal: boolean = false;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'basic',
          data: this.data,
        },
      ],
      chart: {
        type: 'bar',
        height: 220,
        foreColor: 'var(--color-base-content)',
        toolbar: {
          show: false,
        },
      },
      title: {
        text: this.title,
        align: 'left',
        style: {
          color: 'var(--color-primary)',
          fontSize: '18px',
          fontWeight: '600',
        },
      },
      plotOptions: {
        bar: {
          horizontal: this.horizontal,
          barHeight: '80%',
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ['var(--color-primary-content)'],
          fontWeight: 'bold',
        },
      },
      xaxis: {
        categories: this.categories,
        labels: {
          style: {
            colors: 'var(--color-base-content)',
          },
        },
        axisBorder: {
          show: true,
          color: 'var(--color-base-300)',
        },
        axisTicks: {
          show: true,
          color: 'var(--color-base-300)',
        },
      },
      grid: {
        borderColor: 'var(--color-base-300)',
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.1,
        },
        strokeDashArray: 4,

        xaxis: {
          lines: { show: false },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      fill: {
        colors: [
          'var(--color-primary)',
          'var(--color-secondary)',
          'var(--color-accent)',
          'var(--color-info)',
          'var(--color-success)',
          'var(--color-warning)',
        ],
        opacity: 0.85,
      },
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] ||
      changes['categories'] ||
      changes['title'] ||
      changes['horizontal']
    ) {
      this.chartOptions.series = [
        {
          name: 'basic',
          data: this.data,
        },
      ];
      this.chartOptions.xaxis.categories = this.categories;
      this.chartOptions.title.text = this.title;
      this.chartOptions.plotOptions.bar.horizontal = this.horizontal;
    }
  }
}
