import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWatchedMoviesPage } from './my-watched-movies.page';

const routes: Routes = [
  {
    path: '',
    component: MyWatchedMoviesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWatchedMoviesPageRoutingModule {}
