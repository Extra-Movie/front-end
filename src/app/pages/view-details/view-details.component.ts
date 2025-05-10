import { Component } from '@angular/core';
import { Series } from '../../Types/series.model';
import { ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../services/server/series.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-details',
  imports: [CommonModule],
  templateUrl: './view-details.component.html',
  styles: ``
})
export class ViewDetailsComponent {
  seriesId!: string;
  seriesDetails!: Series | null;
  isError = false;

  constructor(private route: ActivatedRoute, private seriesService: SeriesService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.seriesId = params['id'];
      console.log( this.seriesId );
      this.loadSeriesDetails(this.seriesId);
    });
  }

  loadSeriesDetails(id: string) {
    this.seriesService.getSeriesById(id).subscribe(res => {
      if ((res as any).state === 'error') {
        this.isError = true;
        this.seriesDetails = null;
      } else {
        this.seriesDetails = (res as any).tvShow;
        console.log('Series Details:', this.seriesDetails); // 👈 Add this
      }
    });
  }


}
