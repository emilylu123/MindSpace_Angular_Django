import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';

import { TimelinePage } from './timeline.page';
//Calendar
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [TimelinePage],
  entryComponents: [TimelinePage],
})
export class TimelinePageModule {}
