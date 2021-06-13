import { Emotion } from './emotion.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.scss'],
})
export class EmotionsComponent implements OnInit {
  // emotionsList: Emotion[] = [
  //   { id: 'e1', type: 'happy', name: 'Excitement', times: 23 },
  //   { id: 'e2', type: 'happy', name: 'Peace', times: 18 },
  //   { id: 'e3', type: 'sad', name: 'Disappointment', times: 14 },
  //   { id: 'e4', type: 'anger', name: 'Fury', times: 12 },
  //   { id: 'e5', type: 'fear', name: 'Anxiety', times: 11 },
  //   { id: 'e6', type: 'fear', name: 'Panic', times: 9 },
  //   { id: 'e7', type: 'disgust', name: 'Dislike', times: 6 },
  // ];
  constructor() {}

  ngOnInit() {}
}
