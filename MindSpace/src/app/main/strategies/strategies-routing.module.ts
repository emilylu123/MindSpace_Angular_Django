import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StrategiesPage } from './strategies.page';

const routes: Routes = [
  {
    path: '',
    component: StrategiesPage,
  },
  {
    path: ':articleID',
    loadChildren: () =>
      import('./article/article.module').then(
        (m) => m.ArticlePageModule),
  },
  {
    //path: ':articleID',
    //loadChildren:'./article/article.component.module#ArticleModule',
    //component: ArticleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrategiesPageRoutingModule { }
