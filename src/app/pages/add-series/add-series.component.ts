import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeriesService } from '../../services/server/series.service';

@Component({
  selector: 'app-add-series',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-series.component.html',
  styles: ``
})
export class AddSeriesComponent {
  AddSeriesForm: FormGroup;
  files: { [key: string]: File } = {};
  isSubmitting = false;

  constructor(private fb: FormBuilder, private seriesService: SeriesService) {
    console.log('Initializing form to start...');
    this.AddSeriesForm = this.fb.group({
      name: [''],
      original_name: [''],
      first_air_date: [''],
      popularity: [0],
      vote_average: [0],
      vote_count: [0],
      origin_country: [''],
      original_language: [''],
      adult: ['false'],
      overview: [''],
      price: [0],
      number_of_purchases: [0]
    });
  }

  onFileChange(event: any, field: 'poster_path' | 'backdrop_path') {
    console.log(`file input changed for: ${field}`);
    if (event.target.files && event.target.files.length > 0) {
      this.files[field] = event.target.files[0];
      console.log(`selected file for ${field}:`, this.files[field]);
    } else {
      console.warn(`no file selected for ${field}`);
    }
  }

  onSubmit() {
    console.log('clicked submit button');

    if (!this.files['poster_path'] || !this.files['backdrop_path']) {
      alert('Please upload both poster and backdrop images.');
      // console.error('missing image file(s):', this.files);
      return;
    }

    const formData = new FormData();
    const values = this.AddSeriesForm.value;
    console.log('raw form values:', values);


    values.adult = values.adult === 'true' || values.adult === true;
    console.log('parsed adult :', values.adult);


    const originCountryArray = values.origin_country?
     values.origin_country.split(',').map((c: string) => c.trim())
      : [];
    console.log('parsed origin_country:', originCountryArray);

    try {
      formData.append('name', values.name);
      formData.append('original_name', values.original_name);
      formData.append('first_air_date', values.first_air_date);
      formData.append('popularity', values.popularity.toString());
      formData.append('vote_average', values.vote_average.toString());
      formData.append('vote_count', values.vote_count.toString());
      formData.append('origin_country', JSON.stringify(originCountryArray));
      formData.append('original_language', values.original_language);
      formData.append('adult', values.adult.toString());
      formData.append('overview', values.overview);
      formData.append('price', values.price.toString());
      formData.append('number_of_purchases', values.number_of_purchases.toString());
      formData.append('poster_path', this.files['poster_path']);
      formData.append('backdrop_path', this.files['backdrop_path']);

      console.log('formData prepared for submission:', Array.from(formData.entries()));
    } catch (err) {
      console.error('error while appending form data:', err);
      return;
    }

    this.isSubmitting = true;
    console.log('submitting data to seriesService.addSeries...');
    this.seriesService.addSeries(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        console.log('series added successfully');
        alert('series added successfully!');
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('error occurred during submission:', error);
        alert('failed to add series.');
      }
    });
  }
}
