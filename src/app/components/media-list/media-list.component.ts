import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from '../media/media.component';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  popularity: number;
  duration: number;
  director: string;
  overview: string;
  release_date: number;
  price: number;
}

interface Series {
  id: number;
  title: string;
  poster_path: string;
  popularity: number;
  seasons: number;
  episodes: number;
  creator: string;
  overview: string;
  release_date: number;
  price: number;
}

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [CommonModule, MediaComponent],
  templateUrl: './media-list.component.html',
  styles: ``
})
export class MediaListComponent {
  movies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      popularity: 8.8,
      duration: 148,
      director: 'Christopher Nolan',
      overview: 'Miles Morales is now a fugitive on the run from every other Spider in the multiverse. He finds himself in a parallel universe where Peter Parker is Spider-Man.',
      release_date: 2021,
      price: 10.99
    },
    {
      id: 2,
      title: 'The Shawshank Redemption',
      poster_path: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      popularity: 9.3,
      duration: 142,
      director: 'Frank Darabont',
      overview: 'An upcoming film in Phase 6 of the Marvel Cinematic Universe...',
      release_date: 1994,
      price: 9.99
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      popularity: 9.0,
      duration: 152,
      director: 'Christopher Nolan',
      overview: 'Film Gamed',
      release_date: 2008,
      price: 12.99
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      poster_path: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      popularity: 8.9,
      duration: 154,
      director: 'Quentin Tarantino',
      overview: '',
      release_date: 1994,
      price: 10.99
    }
  ];

  series: Series[] = [
    {
      id: 1,
      title: 'Breaking Bad',
      poster_path: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      popularity: 9.5,
      seasons: 5,
      episodes: 62,
      creator: 'Vince Gilligan',
      overview: '',
      release_date: 2008,
      price: 12.99
    },
    {
      id: 2,
      title: 'Game of Thrones',
      poster_path: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
      popularity: 9.3,
      seasons: 8,
      episodes: 73,
      creator: 'David Benioff, D.B. Weiss',
      overview: 'A Song of Ice and Fire. The series takes place on the fictional continents...',
      release_date: 2011,
      price: 12.99
    },
    {
      id: 3,
      title: 'Stranger Things',
      poster_path: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      popularity: 8.7,
      seasons: 4,
      episodes: 34,
      creator: 'The Duffer Brothers',
      overview: '',
      release_date: 2,
      price: 10.99
    },
    {
      id: 4,
      title: 'The Wire',
      poster_path: 'https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg',
      popularity: 9.36,
      seasons: 5,
      episodes: 60,
      creator: 'David Simon',
      overview: '',
      release_date: 2002,
      price: 10.99
    }
  ];
}
