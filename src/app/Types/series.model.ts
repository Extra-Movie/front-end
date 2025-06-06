
export interface Series{
_id: string;
name	:string;
original_name:	string;
backdrop_path:	string;
poster_path	:string;
genre_ids	:number[];
first_air_date:	string;
popularity:	number;
vote_average:	number;
vote_count:	number;
origin_country:string[];
original_language:	string;
adult:	boolean;
overview:	string;
price:	number;
number_of_purchases:number;
}

export interface SeriesResponseType
{
  tvShows : Series[] ,
  page : number ,
  totalPages : number ,
  totalSeries : number
}

export type SeriesFilteredValuesType = {

  //Values To Apply Filteration
  nameValue : string ,
  yearValue : string ,
  genreValue : number ,
  voteValue : number ,
  popularityValue : number | string
}

