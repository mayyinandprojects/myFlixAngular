// src\app\app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
// import { LoginComponent } from './login/login.component';
// import { MovieListComponent } from './movie-list/movie-list.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

const routes: Routes = [
  { path: 'movie-details/:title', component: MovieDetailsComponent }, // Protected route
  {
    path: 'profile/:userId',
    component: ProfileViewComponent,
    canActivate: [AuthGuard],
  }, // Protected route
  { path: 'welcome', component: WelcomePageComponent }, // Public route
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true //add hash strategy which can help prevent 404 errors on page refresh when deployed to GitHub Pages
  })
],
  exports: [RouterModule],
})
export class AppRoutingModule {}
