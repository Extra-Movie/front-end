import { Component,OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidFilter } from '@ng-icons/font-awesome/solid';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute
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
        comedy: [false]
      }),
      year: ['', [Validators.pattern(/^\d{4}$/)]]
    });

    this.filterForm.valueChanges.subscribe(value => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;

    const selectedGenres = Object.entries(formValue.genre)
      .filter(([_, selected]) => selected)
      .map(([genre]) => genre);

    const queryParams: any = {
      ...(formValue.search && { search: formValue.search }),
      ...(formValue.rating && { rating: formValue.rating }),
      ...(formValue.popularity && { popularity: formValue.popularity }),
      ...(selectedGenres.length > 0 && { genres: selectedGenres.join(',') }),
      ...(formValue.year && this.filterForm.controls['year'].valid && { year: formValue.year })
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
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
        comedy: false
      },
      year: ''
    });
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
}
