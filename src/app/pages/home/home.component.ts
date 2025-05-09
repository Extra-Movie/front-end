import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../../services/dark-mode.service';
import { ToastService } from '../../services/toast.service';

import { MovieService } from '../../services/server/movie.service';

import{MovieGenreType,MovieGenreMatchType} from '../../Types/Movie.types' ;


import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule,HeroComponent],
})

export class HomeComponent implements OnInit {
  constructor(private toast: ToastService, private theme: DarkModeService,private movieService:MovieService ) {}

  movieGeners!: MovieGenreType[];
  movieGenersIDGenerated: MovieGenreMatchType = {};
  genreStoreFlag :boolean = false ;

  ngOnInit(): void {

    //store genres in local storage for one time
      this.getGenres() ;

  }

  //get media genres and store it in local storage to execute only request
  getGenres()
  {
    //geners =>
    this.movieService.getMovieGeners().subscribe({
      next: (data: any) => {
        this.movieGeners = data;
        for (let i = 0; i < this.movieGeners.length; i++) {
          this.movieGenersIDGenerated[this.movieGeners[i].name.toLocaleLowerCase()] =
            this.movieGeners[i].id;
        }
        localStorage.setItem('genreTypesObj',JSON.stringify(this.movieGenersIDGenerated)) ;
        console.log(this.movieGenersIDGenerated) ;
      },
      error: (error) => {
        console.log(error);
        this.showErrorToast();
      },
      complete: () => console.log('completed Geners'),
    });
  }


  showToast() {
    this.toast.success('this is a success toast', {
      title: 'Success',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }
  showErrorToast() {
    this.toast.error('this is an error toast', {
      title: 'Error',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  showInfoToast() {
    this.toast.info('this is an info toast', {
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  showWarningToast() {
    this.toast.warning('this is a warning toast', {
      title: 'Warning',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }
  showPrimaryToast() {
    this.toast.custom('this is a primary toast', 'default', {
      title: 'Primary',
      duration: 5000,
      cancelable: true,
      showIcon: true,
    });
  }

  toggleTheme() {
    this.theme.toggleDarkMode();
  }
}
