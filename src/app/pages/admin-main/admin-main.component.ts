import { Component } from '@angular/core';
import { PieComponent } from '../../components/maindashboardcharts/piechat/piechat.component';
import { LinechartComponent } from "../../components/maindashboardcharts/linechart/linechart.component";
import { AreachartComponent } from "../../components/maindashboardcharts/areachart/areachart.component";
import { BarchartComponent } from "../../components/maindashboardcharts/barchart/barchart.component";
import { KpiComponent } from "../../components/maindashboardcharts/kpi/kpi.component";

@Component({
  selector: 'app-admin-main',
  imports: [PieComponent, LinechartComponent, AreachartComponent, BarchartComponent, KpiComponent],
  templateUrl: './admin-main.component.html',
  styles: ``,
})
export class AdminMainComponent {}
