import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Emotion } from '../emotion.model';
import { EmotionsService } from '../emotions.service';
import { InsightService } from './insights.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
})
export class InsightsPage implements OnInit, OnDestroy {
  hashTags: Emotion[] = [];
  emotions: Emotion[] = [];
  topTenEmotions: Emotion[] = [];
  emotionsSub: Subscription;
  awareness: string = '';
  @Input() emo: string;
  hashtag;

  constructor(
    private emotionsService: EmotionsService,
    private modalCtrl: ModalController,
    private insightService: InsightService,
    public authService: AuthService,
  ) {}

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

      console.log(emotionsCount);
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

      console.log(results);

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

      let sortedEmotions = updatedEmotions.sort((a, b) => b.times - a.times);
      this.hashTags = sortedEmotions.slice(0, 10);
      //console.log('Hashtags for today:', this.hashTags);
    });

    this.hashtag = {
      name: this.emo,
    };

    this.onClickHashtag(this.hashtag);
    console.log(this.hashtag);
  }

  ionViewWillEnter() {
    //This will update emotions, which will then trigger the above subscription
    this.emotionsService.updateEmotionsFromServer();
  }

  onClickHashtag(tag: Emotion) {
    this.hashtag = tag;
  }

  // Post hashtag & awareness
  async onClickAddAwareness(content: string) {
    this.awareness = content;

    // TODO: post #hashtag + awareness to backend
    this.insightService.updateReflection(this.awareness, this.hashtag.name).subscribe(data => {
      console.log(data['_body']);
    }, error => {
      console.log(error);
    });;

    // dismiss this modal and deliver data to explore
    await this.modalCtrl.dismiss({
      hashtag: this.hashtag,
      awareness: this.awareness,
    });
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    // Unsubscribe the unused subscription to prevent memory lost
    if (this.emotionsSub) {
      this.emotionsSub.unsubscribe;
    }
  }
}
