import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'my-saved-movies',
    loadChildren: () => import('./my-saved-movies/my-saved-movies.module').then( m => m.MySavedMoviesPageModule)
  },
  {
    path: 'my-watched-movies',
    loadChildren: () => import('./my-watched-movies/my-watched-movies.module').then( m => m.MyWatchedMoviesPageModule)
  },
  {
    path: 'my-friends',
    loadChildren: () => import('./my-friends/my-friends.module').then( m => m.MyFriendsPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'movie-ideas',
    loadChildren: () => import('./movie-ideas/movie-ideas.module').then( m => m.MovieIdeasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
