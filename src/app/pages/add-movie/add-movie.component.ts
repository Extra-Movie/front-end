import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/server/movie.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-movie.component.html',
  styles: ``,
})
export class AddMovieComponent {
  AddMovieForm: FormGroup;
  files: { [key: string]: File } = {};
  isSubmitting = false;

  constructor(private fb: FormBuilder, private movieService: MovieService) {
    console.log('Initializing form to start...');
    this.AddMovieForm = this.fb.group({
      title: [''],
      original_title: [''],
      release_date: [''],
      popularity: [0],
      vote_average: [0],
      vote_count: [0],
      adult: [false],
      video:[false],
      overview: [''],
      price: [0],
      number_of_purchases: [0],
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
      return;
    }

    const formData = new FormData();
    const values = this.AddMovieForm.value;
    console.log('raw form values:', values);

    values.adult = values.adult === 'true' || values.adult === true;
    console.log('parsed adult:', values.adult);

     values.video = values.video === 'true' || values.video === true;
    console.log('parsed video:', values.video);

    try {
      formData.append('title', values.title);
      formData.append('original_title', values.original_title);
      formData.append('release_date', values.release_date);
      formData.append('popularity', values.popularity.toString());
      formData.append('vote_average', values.vote_average.toString());
      formData.append('vote_count', values.vote_count.toString());
      formData.append('adult', values.adult.toString());
       formData.append('video', values.video.toString());
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
    console.log('submitting data to movieService.addMovie...');
    this.movieService.addMovie(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        console.log('movie added successfully');
        alert('movie added successfully!');
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('error occurred during submission:', error);
        alert('failed to add movie.');
      },
    });
  }
}
