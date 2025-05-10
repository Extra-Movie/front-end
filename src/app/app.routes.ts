import { Routes } from '@angular/router';
import { NavLayoutComponent } from './layouts/nav-layout/nav-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { SeriesComponent } from './pages/series/series.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies.component';
import { AdminSeriesComponent } from './pages/admin-series/admin-series.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminMainComponent } from './pages/admin-main/admin-main.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SeriesDetailsComponent } from './pages/series-details/series-details.component';

export const routes: Routes = [
  {
    path: '',
    component: NavLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, //change again ghada
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'About',
      }, //about
      {
        path: 'contact-us',
        component: ContactUsComponent,
        title: 'Contact Us',
      }, //contact us
      {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout',
      }, //contact us
      {
        path: 'movies',
        component: MoviesComponent,
        title: 'Movies',
      }, //Movies
      {
        path: 'movies/:id',
        component: MovieDetailsComponent,
        title: 'Movie Details',
      }, //Movies Details
      {
        path: 'series',
        component: SeriesComponent,
        title: 'Series',
      }, //Series
      {
        path: 'series/:id',
        component: SeriesDetailsComponent,
        title: 'Series Details',
      }, //Series Details
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        component: AdminMainComponent,
      },
      {
        path: 'movies',
        component: AdminMoviesComponent,
      },
      {
        path: 'series',
        component: AdminSeriesComponent,
      },
      {
        path: 'users',
        component: AdminUsersComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
