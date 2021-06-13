import { Emotion } from './main/emotion.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title: string = 'MindSpace';
  constructor() {}
}
