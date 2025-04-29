import { Routes } from '@angular/router';
import { NavLayoutComponent } from './layouts/nav-layout/nav-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorComponent } from './pages/error/error.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';

export const routes: Routes = [
  {
    path: '',
    component: NavLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },  //change again ghada
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path:'about',component:AboutComponent
  },  //about
  {
    path:'contactUs',component:ContactUsComponent
  },  //contact us
  {
    path: '**',
    component: NotFoundComponent,
  },
];
