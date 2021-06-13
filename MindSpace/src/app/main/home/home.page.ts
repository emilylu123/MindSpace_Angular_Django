import { EmotionListService } from './../emotion-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Emotion } from '../emotion.model';
import { EmotionsService } from '../emotions.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  name: string = '';
  emotionsSub: Subscription;
  loadedEmotions: Emotion[] = [];
  topFiveEmotions: Emotion[] = [];

  circlesPos = [
    { top: '10%', left: '34%' },
    { top: '30%', left: '15%' },
    { top: '30%', left: '53%' },
    { top: '56%', left: '47%' },
    { top: '56%', left: '24%' },
  ];

  textPos = [
    { top: '-5%', left: '50%' },
    { top: '48%', left: '-13%' },
    { top: '50%', left: '80%' },
    { top: '110%', left: '80%' },
    { top: '110%', left: '-15%' },
  ];

  constructor(
    private emotionsService: EmotionsService,
    private emotionListService : EmotionListService,
    public authService: AuthService,
  ) {
    if (authService.isLoggedIn) {
      this.name = authService.userData.displayName || 'Dear';
    }
  }

  ngOnInit() {
    //Now emotions becomes an observable object
    //  with .subscribe(), the callback function will run everytime when _emotions is updated
    this.emotionsSub = this.emotionsService.emotions.subscribe((records) => {
      //First, convert from server format to:
      //  {'emotion1':[freq1], 'emotion2':[freq2], ...}
      let emotionsCount = records.reduce((emotions, record) => {
        emotions[record.emotion]
          ? emotions[record.emotion]++
          : (emotions[record.emotion] = 1);
        return emotions;
      }, {});

      //Then, convert {'emotion1':[freq1], 'emotion2':[freq2], ...} to:
      //  [{id:1, name:'emotion1', times: [freq1]},
      //   {id:2, name:'emotion2', times: [freq2]}]
      let results = Object.keys(emotionsCount).map((emotion, index) => {
        return {
          id: index.toString(),
          name: emotion,
          times: emotionsCount[emotion],
        };
      });

      let updatedEmotions: Emotion[] = results.map((result) => {
        let type = '';
        if (
          result.name == 'joy' ||
          result.name == 'happy' ||
          result.name == 'gratitude' ||
          result.name == 'admiration' ||
          result.name == 'optimism' ||
          result.name == 'relief' ||
          result.name == 'love'
        ) {
          type = 'happy';
        }
        if (
          result.name == 'sadness' ||
          result.name == 'grief' ||
          result.name == 'remorse' ||
          result.name == 'disappointment'
        ) {
          type = 'sad';
        }
        if (result.name == 'anger' || result.name == 'annoyance') {
          type = 'anger';
        }
        if (result.name == 'fear' || result.name == 'nervousness') {
          type = 'fear';
        }
        if (
          result.name == 'disgust' ||
          result.name == 'embarrass' ||
          result.name == 'confusion'
        ) {
          type = 'disgust';
        }
        if (
          result.name == 'surprise' ||
          result.name == 'excitement' ||
          result.name == 'amusement' ||
          result.name == 'pride'
        ) {
          type = 'excited';
        }
        if (
          result.name == 'neutral' ||
          result.name == 'desire' ||
          result.name == 'curiosity' ||
          result.name == 'realization' ||
          result.name == 'caring' ||
          result.name == 'disapproval' ||
          result.name == 'approval'
        ) {
          type = 'neutral';
        }
        return { ...result, type };
      });

      let emotions = updatedEmotions.sort((a, b) => b.times - a.times);
      this.loadedEmotions = emotions.map((emotion) => {
        ///
        let transformed_size = 25 + emotion.times / 1.5 + '%';
        ///
        return { ...emotion, size: transformed_size };
      });
      //console.log(this.loadedEmotions);
      this.emotionListService.addRecords(this.loadedEmotions)
      this.topFiveEmotions = this.loadedEmotions.slice(0, 5);
    });
  }

  ionViewWillEnter() {
    //This will update emotions, which will then trigger the above subscription
    this.emotionsService.updateEmotionsFromServer();
    this.emotionListService.clearRecords();
  }


  ngOnDestroy() {
    // Unsubscribe the unused subscription to prevent memory lost
    if (this.emotionsSub) {
      this.emotionsSub.unsubscribe;
    }
  }
}
