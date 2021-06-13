import { ArticlePage } from './article';
import { NgModule } from '@angular/core';
import { Routes, RouterModule,  } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ArticlePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlePageRoutingModule { }
