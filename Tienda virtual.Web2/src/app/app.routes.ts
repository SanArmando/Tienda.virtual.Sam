import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Details } from './components/details/details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page'
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Details page'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-crud/product-crud').then(m => m.ProductCrud),
    title: 'Productos'
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user-module').then(m => m.UserModule)
  }
];