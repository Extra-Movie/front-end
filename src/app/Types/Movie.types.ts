export type MovieType =
{
  _id : string ,
  id: number ,
  original_language : string ,
  title	: string ,
  original_title	: string ,
  backdrop_path	: string ,
  poster_path	: string ,
  genre_ids	: number[] ,
  release_date	: string ,
  popularity	: number ,
  vote_average	: number ,
  vote_count	: number ,
  adult	: boolean ,
  video	: boolean ,
  overview	: string ,
  price	: number ,
  number_of_purchases : number
}

export type MovieResponseType = {
  movies : MovieType[] ,
  page : number ,
  totalPages : number ,
  totalMovies : number
}


export type MovieGenreType = {
  id :	number ,
  name :	string
}

export interface MovieGenreMatchType {
  [key: string]: number;
}

export type MovieFilteredValuesType = {

  //Values To Apply Filteration
  nameValue : string ,
  yearValue : string ,
  genreValue : number ,
  voteValue : number ,
  popularityValue : number | string
}
