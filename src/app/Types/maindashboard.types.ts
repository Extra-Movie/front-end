import { Movie } from './media.types';
export type TotalType<T extends string> = {
  [key in T]: number;
};
export type totalUsersType = TotalType<'totalUsers'>;
export type totalSalesType = TotalType<'totalTransactions'>;
export type totalRevenueType = TotalType<'totalRevenue'>;
export type cartFrequencyType = TotalType<'totalUsers'>;

export type usersByRoleType = [
  {
    totalCount: string;
    users: number;
    role: string;
  }
];

export type userGrowthType = [
  {
    totalCount: number;
    month: string;
  }
];

export type monthlySalesTrendType = [
  {
    totalSales: number;
    month: string;
  }
];

export type topSellingMovieType = {
  _id: string;
  title: string;
  number_of_purchases: number;
}[];
export type topSellingSerieType = {
  _id: string;
  name: string;
  number_of_purchases: number;
}[];

export type topSellingContentResponseType = {
  movies: topSellingMovieType;
  tvShows: topSellingSerieType;
};

