import { Injectable } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Emotion } from './emotion.model';
import { Record } from './record.model';

@Injectable({
  providedIn: 'root'
})
export class EmotionListService {
  emotionList: Emotion[] = [];

  constructor() { }

  addRecords(item: any) {
    //this.emotionList.push(item);
    this.emotionList = item;
  }

  getEmotionID(emotionID: string) {
    return {
      ...this.emotionList.find(emotion => {
        return emotion.id === emotionID;
      })
    };
  }

  getRecords() {
    return [... this.emotionList]
  }

  getType(emoName: string) {
    for (let i = 0; i < this.emotionList.length; i++)  {
      var _name = this.emotionList[i].name;
      console.log("before");
      if (emoName == _name) {
        return this.emotionList[i].type;
        break;
      }
    }
  }

  totalCounts() {
    var sum: number = 0;
    for (let i = 0; i < this.emotionList.length; i++) {
      var a: number = +this.emotionList[i].times;
      sum += a;
    }

    return sum;
  }

  countsOfEmo(emoName: string) {
    for (let i = 0; i < this.emotionList.length; i++) {
      var _name: string = this.emotionList[i].name;
      if (emoName == _name) {
        return this.emotionList[i].times;
        break;
      }
    }
    return 0;
  }

  nextEmo(emoName: string) {
    for (let i = 0; i < this.emotionList.length; i++) {
      var _name: string = this.emotionList[i].name;
      if (emoName == _name) {
        if (i == 27) {
          return this.emotionList[0].name;
        }
        else {
          return this.emotionList[i + 1].name;
        }
        break;
      }
    }
  }

  prevEmo(emoName: string) {
    for (let i = 0; i < this.emotionList.length; i++) {
      var _name: string = this.emotionList[i].name;
      if (emoName == _name) {
        if (i == 0) {
          return this.emotionList[27].name;
        }
        else {
          return this.emotionList[i - 1].name;
        }
        break;
      }
    }
  }

  clearRecords() {
    this.emotionList = [];
  }
}
