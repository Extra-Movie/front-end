import { Component, OnInit, Input } from '@angular/core';
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
  selector: 'app-filter-model',
  imports: [NgIcon, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './filter-modal.component.html',
  styles: ``,
  viewProviders: [provideIcons({ faSolidFilter })],
})
export class FilterModelComponent implements OnInit {
  @Input() type: string = '';

  filterForm!: FormGroup;
  genresState!: Genre[];
  currentPath: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      rating: [0],
      popularity: [''],
      genre: [''],
      year: ['', [Validators.pattern(/^\d{4}$/)]],
    });

    const genreType = this.type;
    console.log(genreType);

    //get movie genres
    if (genreType == 'movies') {
      this.genresService.getMovieGenres().subscribe((state) => {
        if (state.state === 'loaded') {
          this.genresState = state.data;
        } else if (state.state === 'loading') {
        } else console.log(state.error);
      });
    }

    //get series genres
    if (genreType == 'series') {
      this.genresService.getSeriesGenres().subscribe((state) => {
        if (state.state === 'loaded') {
          this.genresState = state.data;
        } else if (state.state === 'loading') {
        } else console.log(state.error);
      });
    }
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
  onSubmit(): void {
    if (this.filterForm.valid) {
      const raw = this.filterForm.value;

      const defaultValues = {
        search: '',
        rating: 0,
        popularity: '',
        year: '',
      };

      const queryParams: any = {};

      if (raw.search !== defaultValues.search) queryParams.search = raw.search;
      if (raw.rating !== defaultValues.rating) {
        switch (raw.rating) {
          case 0: {
            raw.rating = null;
            break;
          }
          case 1: {
            raw.rating = 2;
            break;
          }
          case 2: {
            raw.rating = 3.5;
            break;
          }
          case 3: {
            raw.rating = 5;
            break;
          }
          case 4: {
            raw.rating = 6.5;
            break;
          }
          case 5: {
            raw.rating = 8;
            break;
          }
        }
        queryParams.rating = raw.rating;
      }
      if (raw.popularity !== defaultValues.popularity)
        queryParams.popularity = raw.popularity;
      if (raw.year !== defaultValues.year) queryParams.year = raw.year;

      if (raw.genre) {
        const selectedGenreId = raw.genre;
        if (selectedGenreId) {
          queryParams.genre = selectedGenreId;
        }
      }

      this.router.navigate([], {
        queryParams,
      });
    } else {
      this.filterForm.markAllAsTouched();
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      rating: 0,
      popularity: '',
      genre: '',
      year: '',
    });

    this.router.navigate([], {
      queryParams: {},
    });
  }
}
