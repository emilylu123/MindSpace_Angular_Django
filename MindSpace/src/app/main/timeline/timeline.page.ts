import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { InsightService } from '../insights/insights.service';
import { EmotionsService } from '../emotions.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { CalendarComponent } from 'ionic2-calendar';
import { ModalController } from '@ionic/angular';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Insight } from '../insights/insight.model';
import { Emotion } from '../emotion.model';
import { Record } from '../record.model';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  eventSource = [];
  viewTitle: string;
  isToday: boolean;
  selectedDate: Date = new Date();
  block = false;
  isShow = false;

  emotionsSub: Subscription;
  reflectionsSub: Subscription;

  public getReflection: Insight[] = [];
  public matchedReflection: string[] = [];
  private ref_record = new BehaviorSubject<Insight[]>([]);

  public allRecords: Record[] = [];
  public matchedEmotions: Emotion[] = [];

  constructor(
    public authService: AuthService,
    public modalCtrl: ModalController,
    private insightService: InsightService,
    private emotionsService: EmotionsService
  ) {}

  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function (date: Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function (date: Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function (date: Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function (date: Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function (date: Date) {
        return 'testDH';
      },
      formatDayViewTitle: function (date: Date) {
        return 'testDT';
      },
    },
  };

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  get reflections() {
    // Return this._emotions observable for subsciption
    return this.ref_record.asObservable();
  }

  updateMatchedReflection() {
    const newDate = moment(this.selectedDate).format('YYYY-MM-DD');

    if (this.matchedReflection.length != 0) {
      this.matchedReflection = [];
    }
    for (var i = 0; i < this.getReflection.length; i++) {
      if (this.getReflection[i].posted_date == newDate) {
        this.matchedReflection.push(this.getReflection[i].reflection);
      }
    }
  }

  updateMatchedEmotion() {
    //filtered by all data by selected date range and emoTitle
    let selectedRecords = this.allRecords.filter((record) => {
      let posted_date_obj: moment.Moment = moment(
        record.posted_date,
        'YYYY-MM-DD'
      );
      return posted_date_obj.isSame(
        moment(this.selectedDate).format('YYYY-MM-DD')
      );
    });
    console.log(selectedRecords);

    let emotionsCount = selectedRecords.reduce((emotions, record) => {
      emotions[record.emotion]
        ? emotions[record.emotion]++
        : (emotions[record.emotion] = 1);
      return emotions;
    }, {});

    //Convert {'emotion1':[freq1], 'emotion2':[freq2], ...} to:
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

    console.log(updatedEmotions);

    this.matchedEmotions = updatedEmotions;
  }

  passedDate(selectedDate) {
    const date = new Date();
    this.selectedDate = selectedDate;

    if (selectedDate < date) {
      this.block = true;
    } else {
      this.block = false;
    }

    this.updateMatchedReflection();
    this.updateMatchedEmotion();
  }

  today() {
    this.calendar.currentDate = new Date();
    console.log('Date:', this.calendar.currentDate);
  }

  slidePrev() {
    this.myCalendar.slidePrev();
    this.myCalendar.update();
  }

  slideNext() {
    this.myCalendar.slideNext();
    this.myCalendar.update();
  }

  // onCurrentDateChanged(event: Date) {
  //   var today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   event.setHours(0, 0, 0, 0);
  //   this.isToday = today.getTime() === event.getTime();
  // }

  ngOnInit() {
    this.emotionsSub = this.emotionsService.emotions.subscribe((records) => {
      this.allRecords = records;
      this.updateMatchedEmotion();
    });
    this.reflectionsSub = this.ref_record.subscribe((insights) => {
      this.getReflection = insights;
      this.updateMatchedReflection();
    });
  }

  ionViewWillEnter() {
    //This will ref_record, which will then trigger the above subscription
    this.insightService
      .updateReflectionsFromServer()
      .subscribe((records: Insight[]) => {
        this.ref_record.next(records);
      });

    this.emotionsService.updateEmotionsFromServer();
  }

  removeEvents() {
    this.eventSource = [];
  }

  ngOnDestroy() {
    // Unsubscribe the unused subscription to prevent memory lost
    if (this.reflectionsSub) {
      this.reflectionsSub.unsubscribe;
    }

    if (this.emotionsSub) {
      this.emotionsSub.unsubscribe;
    }
  }
}
