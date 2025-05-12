import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoadingState } from '../../Types/loading-state.model';
import { Series } from '../../Types/series.model';
import { Observable } from 'rxjs';
import { SeriesService } from '../../services/server/series.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  imports:[CommonModule,FormsModule,RouterLink]
})

export class SeriesListComponent implements OnInit {
  Activepage=1;
  topWatch:number=15;
  topTrend:number=15;
  topWatching: Series[] = [];
  topTrending: Series[] = [];
  filters={
     search:'',
     year:'',
     popularity:0,
     vote_average:0
  }


  newSeries: Series = {
    _id:'',
    name: '',
    original_name: '',
    genre_ids: [],
    vote_average: 0,
    popularity: 0,
    overview: '',
    poster_path: '',
    backdrop_path: '',
    original_language: '',
    first_air_date: '',
    origin_country: [],
    vote_count: 0,
    adult: false,
    price: 0,
    number_of_purchases: 0
  };

  seriesState!: Observable<LoadingState<Series[]>>;

  constructor(private seriesService: SeriesService) {}

  ngOnInit(): void {
    this.loadSeries(1);  //load first page by default
    this.loadTopSeries(); //call this if want display top trend and watched
  }

  loadSeries(page: number): void {
    this.Activepage=page;
    this.seriesState = this.seriesService.getAllSeries(page,this.filters.search,this.filters.year,this.filters.popularity,this.filters.vote_average); //send page number to filter
  }
  search(){
    this.loadSeries(this.Activepage);
  }
  loadTopSeries(): void {
    this.loadSeries(this.Activepage);
    this.seriesService.getAllSeries(this.Activepage, '', '', 0, 0).subscribe((state: LoadingState<Series[]>) => {
      if (state.state === 'loaded') {
        this.topWatching = this.seriesService.topWatchedSeries(state.data, this.topWatch);
        this.topTrending = this.seriesService.topTrendingSeries(state.data, this.topTrend);
      }
    });
  }
  deleteSeries(_id: string): void {
    if (confirm('Are you sure you want to delete this series?')) {
      this.seriesService.deleteSeriesById(_id).subscribe(() => {
        alert('series deleted successfully.');
        this.loadSeries(this.Activepage);
      });
    }
  }
  addSeries(): void {
    if (confirm('Are you sure you want to add this series?')) {
      this.seriesService.addSeries(this.newSeries).subscribe(() => {
        alert('series added successfully.');
        this.loadSeries(this.Activepage);
        this.resetNewSeries();
      });
    }
  }
  resetNewSeries(): void {
    this.newSeries = {
      _id:'',
      name: '',
      original_name: '',
      genre_ids: [],
      vote_average: 0,
      popularity: 0,
      overview: '',
      poster_path: '',
      backdrop_path: '',
      original_language: '',
      first_air_date: '',
      origin_country: [],
      vote_count: 0,
      adult: false,
      price: 0,
      number_of_purchases: 0
    };
  }


}
