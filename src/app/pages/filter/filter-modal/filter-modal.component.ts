import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidFilter } from '@ng-icons/font-awesome/solid';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GenresService } from '../../../services/server/genres.service';
import { LoadingState } from '../../../Types/loading-state.model';
import { Genre } from '../../../Types/genres.types';

@Component({
  selector: 'app-filter-modal',
  imports: [NgIcon, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './filter-modal.component.html',
  styles: ``,
  viewProviders: [provideIcons({ faSolidFilter })],
})
export class FilterModalComponent implements OnInit {
  filterForm!: FormGroup;
  movieGenresState!: Genre[];
  seriesGenresState!: Genre[];
  currentPath: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      rating: [3],
      popularity: ['Most Popular'],
      genre: this.fb.group({
        action: [false],
        adventure: [false],
        drama: [false],
        comedy: [false],
      }),
      year: ['', [Validators.pattern(/^\d{4}$/)]],
    });

    //get movie genres
    this.genresService.getMovieGenres().subscribe((state) => {
      if (state.state === 'loaded') {
        this.movieGenresState = state.data;

        const genreGroup = this.fb.group({});
        this.movieGenresState.forEach((g) => {
          genreGroup.addControl(g.id.toString(), this.fb.control(false));
        });

        this.filterForm.setControl('genre', genreGroup);
      }
    });

    //get series genres
    this.genresService.getSeriesGenres().subscribe((state) => {
      if (state.state === 'loaded') {
        this.seriesGenresState = state.data;
      } else if (state.state === 'loading') {
      } else console.log(state.error);
    });

    this.currentPath = this.router.url.split('?');
    console.log('Current path:', this.currentPath);
  }

  //!--------send all of the form data
  // onSubmit(): void {
  //   if (this.filterForm.valid) {
  //     const raw = this.filterForm.value;

  //     const selectedGenres = raw.genres
  //       ? Object.keys(raw.genres).filter((key) => raw.genres[key])
  //       : [];

  //     const queryParams: any = {
  //       search: raw.search,
  //       rating: raw.rating,
  //       popularity: raw.popularity,
  //       genres: selectedGenres.join(','),
  //       year: raw.year
  //     };

  //     this.router.navigate([], {
  //       queryParams,
  //       queryParamsHandling: 'merge',
  //     });
  //   } else {
  //     this.filterForm.markAllAsTouched();
  //   }
  // }

  //^--------send only changed form data
  onSubmit(modal: HTMLDialogElement): void {
    if (this.filterForm.valid) {
      const raw = this.filterForm.value;

      const defaultValues = {
        search: '',
        rating: 3,
        popularity: 'Most Popular',
        year: '',
      };

      const queryParams: any = {};

      if (raw.search !== defaultValues.search) queryParams.search = raw.search;
      if (raw.rating !== defaultValues.rating) queryParams.rating = raw.rating;
      if (raw.popularity !== defaultValues.popularity)
        queryParams.popularity = raw.popularity;
      if (raw.year !== defaultValues.year) queryParams.year = raw.year;

      if (raw.genre) {
        const selectedGenreIds = Object.keys(raw.genre).filter(
          (key) => raw.genre[key]
        );

        if (selectedGenreIds.length > 0) {
          queryParams.genres = selectedGenreIds.join(',');
        }
      }

      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge',
      });
      modal.close();
    } else {
      this.filterForm.markAllAsTouched();
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      rating: 3,
      popularity: 'Most Popular',
      genre: {
        action: false,
        adventure: false,
        drama: false,
        comedy: false,
      },
      year: '',
    });

    this.router.navigate([], {
      queryParams: {},
    });
  }
}
