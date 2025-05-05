import { Component, OnInit } from '@angular/core';
import { MovieService } from './../../services/server/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  MovieType,
} from '../../Types/Movie.types';





@Component({
  selector: 'app-movie-details-test',
  imports: [CommonModule, HttpClientModule,RouterLink],
  providers: [MovieService],
  templateUrl: './movie-details-test.component.html',
  styles: ``
})
export class MovieDetailsTestComponent implements OnInit{

  movieID! : string ;
  movieDetails! :MovieType ;

  constructor(private movieService:MovieService , private activeRoute :ActivatedRoute ){
    this.movieID = this.activeRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getMovieAllDetails(this.movieID) ;
  }
 ;


    //get Movie Details
    getMovieAllDetails(id:string){
      this.movieService.getMovieDetails(id).subscribe({
      next: (data: any) => {
        this.movieDetails = data.movie ;
        console.log(this.movieDetails) ;
      },
      error: (error) => console.log(error),
      complete: () => console.log('completed Geners'),
    });
    }


}
