import { MovieType } from './Movie.types';
import { Series } from './series.model';

export type userResponse = {
  message: string;
};

export type userLists = {
  item: string;
  kind: string;
};
export type userListsResponse = {
  message: string;
  data: userLists[];
};

export type userData = {
  name: string;
  email: string;
  isAdmin: boolean;
  owned: userLists[];
  watchlist: userLists[];
  cart: userLists[];
};

export type CartResponse = {
  cart: CartItem[];
};
export type WatchListResponse = {
  watchlist: CartItem[];
};

export type CartItem =
  | {
      kind: 'movies';
      item: MovieType;
      _id: string;
    }
  | {
      kind: 'tvShows';
      item: Series;
      _id: string;
    };
