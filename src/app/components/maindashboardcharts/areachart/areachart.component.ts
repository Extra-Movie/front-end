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
export class AreachartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = '';

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Value',
          data: this.data,
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
        text: this.title,
        align: 'left',
        style: {
          color: 'var(--color-primary)',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        type: 'category',
        categories: this.categories,
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
