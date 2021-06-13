import { ArticleListItemComponent } from './articleList/article-list-item.component';
import { ArticlePage } from './article/article';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrategiesPageRoutingModule } from './strategies-routing.module';

import { StrategiesPage } from './strategies.page';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrategiesPageRoutingModule,
  ],
  providers: [InAppBrowser],
  declarations: [StrategiesPage, ArticleListItemComponent]
})
export class StrategiesPageModule {}
