export interface Mediaitems {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  popularity: number;
  release_date: string;
  price: number;

}

export interface Movie extends Mediaitems {
  duration: number;
  director: string;
}

export interface Series extends Mediaitems {
  seasons: number;
  episodes: number;
  creator: string;
}
