import { ArticlePageRoutingModule } from './article-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArticlePage } from './article';
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ArticlePageRoutingModule,
  ],
  declarations: [ArticlePage],
})
export class ArticlePageModule { }
