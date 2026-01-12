import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Users } from './users/users';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [


    { path: 'login', component: Login },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: Register },
    {
      path: 'users',
      component: Users,
      canActivate: [authGuard],
    },
    { path: '**', redirectTo: 'login' }
];
