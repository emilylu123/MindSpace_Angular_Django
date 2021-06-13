import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';
import { ExplorePage } from './explore.page';
import { InsightsPage } from './../insights/insights.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ExplorePageRoutingModule, HighchartsChartModule, NgCircleProgressModule.forRoot({
    // set defaults here
    radius: 100,
    outerStrokeWidth: 12,
    innerStrokeWidth: 6,
    outerStrokeColor: "#78C000",
    innerStrokeColor: "#C7E596",
    animationDuration: 300,

  }),
  ],
  declarations: [ExplorePage, InsightsPage],
})
export class ExplorePageModule {}
