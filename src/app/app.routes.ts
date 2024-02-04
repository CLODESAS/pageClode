import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { E404Component } from './e404/e404.component';

export const routes: Routes = [ 
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'e404', component: E404Component },
    { path: '**', redirectTo: '/e404', pathMatch: 'full'}
];
