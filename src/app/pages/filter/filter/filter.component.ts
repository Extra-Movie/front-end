import { Component,OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidFilter } from '@ng-icons/font-awesome/solid';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-filter',
  imports: [NgIcon,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styles: ``,
  viewProviders: [provideIcons({faSolidFilter})]
})
export class FilterComponent implements OnInit{

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}


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
        rating: 3,
        popularity: 'Most Popular',
        genre: {
          action: false,
          adventure: false,
          drama: false,
          comedy: false,
        },
        year: '',
      };
  
      const queryParams: any = {};
  
      if (raw.search !== defaultValues.search) queryParams.search = raw.search;
      if (raw.rating !== defaultValues.rating) queryParams.rating = raw.rating;
      if (raw.popularity !== defaultValues.popularity)
        queryParams.popularity = raw.popularity;
      if (raw.year !== defaultValues.year) queryParams.year = raw.year;
  
      if (raw.genre) {
        const selectedGenres = Object.keys(raw.genre).filter(
          (key) => raw.genre[key]
        );
        if (selectedGenres.length > 0) {
          queryParams.genres = selectedGenres.join(',');
        }
      }
  
      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge',
      });
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
  
  
  

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      rating: [3],
      popularity: ['Most Popular'],
      genre: this.fb.group({
        action: [false],
        adventure: [false],
        drama: [false],
        comedy: [false]
      }),
      year: ['', [Validators.pattern(/^\d{4}$/)]]
    });

  
  }

}
