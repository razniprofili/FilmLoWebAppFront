import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySavedMoviesPage } from './my-saved-movies.page';

const routes: Routes = [
  {
    path: '',
    component: MySavedMoviesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySavedMoviesPageRoutingModule {}
