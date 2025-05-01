import { Routes } from '@angular/router';
import { NavLayoutComponent } from './layouts/nav-layout/nav-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: NavLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
  {

    path: 'register',
    component: RegisterComponent,
    title:"Register"
  },
  {
    path: 'login',
    component: LoginComponent,
    title:"Login"
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
