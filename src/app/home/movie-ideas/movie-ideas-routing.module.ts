import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieIdeasPage } from './movie-ideas.page';

const routes: Routes = [
  {
    path: '',
    component: MovieIdeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieIdeasPageRoutingModule {}
