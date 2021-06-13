import { EmotionListService } from './../emotion-list.service';
import { Emotion } from './../emotion.model';
import { Record } from '../record.model';
import { InsightsPage } from './../insights/insights.page';
import { Component, Input, OnInit, Pipe } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';

import * as moment from 'moment';
import * as Highcharts from 'highcharts';

import { EmotionsService } from '../emotions.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  title: string = 'Explore';
  insights = null;
  emoTitle: string;
  emoTimes: number;
  totalEmoTimes: number;
  emoPercentage: number;
  prevEmoTitle: string;
  nextEmoTitle: string;
  emoType: string;
  color: string;

  //Selected date range
  selectedFrom: moment.Moment;
  selectedTo: moment.Moment;

  //Retrieved emotion records
  allRecords: Record[] = [];

  //Times of selected emotion and trigger keywords freqency within time range
  emotionTimesInTime = {}; // {'date1':freq, 'date2':freq, ...} where date is in the format of YYYY-MM-DD
  triggerKeywordsInTime = {}; // {'emotion1':freq, 'emotion2':freq, ...}

  // times to construct chart
  timesArray = [];

  // Coloumn charts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options

  constructor(
    private route: Router,
    public modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private activeRoute: ActivatedRoute,
    private emotionsService: EmotionsService,
    private emotionListService: EmotionListService,
  ) {

  }

  // Set emoTitle to be the most significant emotion if it is undefined
  setEmoTitleIfNotSet() {
    //compute the emotion count from the selected Record
    let emotionsCount = this.allRecords.reduce((emotions, selectedRecord) => {
      emotions[selectedRecord.emotion]
        ? emotions[selectedRecord.emotion]++
        : (emotions[selectedRecord.emotion] = 1);
      return emotions;
    }, {});

    //if emoTitle is undefined, set the most intense one to be emoTitle
    if (this.emoTitle === undefined) {
      let max = 0;
      let maxEmotion = 'joy'; //Set default to be joy
      for (let emotion in emotionsCount) {
        if (emotionsCount[emotion] > max) {
          max = emotionsCount[emotion];
          maxEmotion = emotion;
        }
      }
      this.emoTitle = maxEmotion;
    }
  }

  // This function should be triggered after selectedFrom and selectedTo are updated
  updateSelected() {
    //filtered by all data by selected date range and emoTitle
    let selectedRecords = this.allRecords.filter((record) => {
      let posted_date_obj: moment.Moment = moment(
        record.posted_date,
        'YYYY-MM-DD'
      );
      return (
        posted_date_obj.isSameOrAfter(this.selectedFrom, 'day') &&
        posted_date_obj.isSameOrBefore(this.selectedTo, 'day') &&
        record.emotion == this.emoTitle
      );
    });
    console.log(selectedRecords);

    //get keywords and their frequency within the time range
    this.triggerKeywordsInTime = {};
    for (let i = 0; i < selectedRecords.length; ++i) {
      for (
        let j = 0;
        j < selectedRecords[i].trigger_keyword_frequency.length;
        ++j
      ) {
        let keyword = selectedRecords[i].trigger_keyword_frequency[j].keyword;
        let frequency =
          selectedRecords[i].trigger_keyword_frequency[j].frequency;
        if (keyword in this.triggerKeywordsInTime) {
          this.triggerKeywordsInTime[keyword] += frequency;
        } else {
          this.triggerKeywordsInTime[keyword] = frequency;
        }
      }
    }
    console.log(this.triggerKeywordsInTime);

    //get times of selected emotions within the time range
    let initialEmotionTimes = {};
    let readingDate = this.selectedFrom.clone();
    while (readingDate.isSameOrBefore(this.selectedTo, 'day')) {
      let readingDateString = readingDate.format('YYYY-MM-DD');
      initialEmotionTimes[readingDateString] = 0;
      readingDate = readingDate.add(1, 'd');
    }
    console.log(initialEmotionTimes);
    this.emotionTimesInTime = selectedRecords.reduce((emotions, record) => {
      ++emotions[record.posted_date];
      return emotions;
    }, initialEmotionTimes);
    console.log(this.emotionTimesInTime);
    this.timesArray = Object.values(this.emotionTimesInTime);
  }

  columnChart() {
    console.log(this.timesArray);
    this.chartOptions = {
      chart: {
        marginLeft: 20,
        marginRight: 230,
        marginBottom: 200,
        spacingTop: 0,
        spacingLeft: 1,
      },
      title: {
        text: null,
      },
      series: [
        {
          type: 'column',
          name: this.emoTitle,
          //data: [1, 2, 3, 4, 5, 3, 2],
          data: this.timesArray,
          showInLegend: false,
          color: this.color,
          borderRadius: 10,
        }
      ],
      xAxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        min: 0,
        visible: false
      },
      plotOptions: {
        column: {
          //pointPadding: 0.1,
          borderWidth: 0,
          //groupPadding: 0.2,
          ///pointWitdh: 1,
        }
      },
      credits: {
        enabled: false
      }
    };
  };

  clickPrev() {
    this.selectedTo = moment(this.selectedFrom).subtract(1, 'd');
    this.selectedFrom = moment(this.selectedFrom).subtract(7, 'd');
    this.updateSelected();
    this.columnChart();
  }

  clickNext() {
    if (this.selectedFrom <= moment() && this.selectedTo >= moment()) { window.alert("There is no more record") }
    else {
      this.selectedFrom = moment(this.selectedTo).add(1, 'd');
      this.selectedTo = moment(this.selectedTo).add(7, 'd');
      this.updateSelected();
      this.columnChart();
    }
  }

  setColor() {
    this.emoType = this.emotionListService.getType(this.emoTitle);
    console.log(this.emoType);
    switch (this.emoType) {
      case "happy": {
        this.color = "#FBE5C8";
        break;
      }
      case "excited": {
        this.color = "#BF4C41";
        break;
      }
      case "sad": {
        this.color = "#8FDDE7";
        break;
      }
      case "anger": {
        this.color = "#EF7C8E";
        break;
      }
      case "fear": {
        this.color = "#877785";
        break;
      }
      case "disgust": {
        this.color = "#B6E2D3";
        break;
      }
      case "neutral": {
        this.color = "#DACAC4";
        break;
      }
      default: {
        this.color = "#607D86";
        break;
      }
    }
  }

  ngOnInit() {

    var today = moment().isoWeekday();
    // if today is sunday
    switch(today){
      case 1:{
        this.selectedFrom = moment();
        this.selectedTo = moment().add(6, 'd');
        break;
      }
      case 2:{
        this.selectedFrom = moment().subtract(1, 'd');
        this.selectedTo = moment().add(5, 'd');
        break;
      }
      case 3:{
        this.selectedFrom = moment().subtract(2, 'd');
        this.selectedTo = moment().add(4, 'd');
        break;
      }
      case 4:{
        this.selectedFrom = moment().subtract(3, 'd');
        this.selectedTo = moment().add(3, 'd');
        break;
      }
      case 5:{
        this.selectedFrom = moment().subtract(4, 'd');
        this.selectedTo = moment().add(2, 'd');
        break;
      }
      case 6:{
        this.selectedFrom = moment().subtract(5, 'd');
        this.selectedTo = moment().add(1, 'd');
        break;
      }
      case 7:{
        this.selectedFrom = moment().subtract(6, 'd');
        this.selectedTo = moment();
        break;
      }
    }

    //this.selectedTo = moment();
    //this.selectedFrom = moment().subtract(6, 'd');

    //For testing, remove it after updating selected date range functionalities is done
    //this.selectedTo = moment('2021-03-28', 'YYYY-MM-DD');
    //this.selectedFrom = moment('2021-03-22', 'YYYY-MM-DD');
    /////////////////////////////////////////////////////////////

    this.activeRoute.params.subscribe((param) => {
      this.emoTitle = param['id'];
    });

    //This function will be triggered everytime when records are returned from server
    this.emotionsService.emotions.subscribe((records: Record[]) => {
      this.allRecords = records;
      this.setEmoTitleIfNotSet();
      this.updateSelected();
      this.setColor();
      this.columnChart();
      //this.clickPrev();
      this.totalEmoTimes = this.emotionListService.totalCounts();
      this.emoTimes = this.emotionListService.countsOfEmo(this.emoTitle);
      if (this.emoTimes > 0) {
        this.emoPercentage = Math.round(this.emoTimes / this.totalEmoTimes * 100);
      }
      else {
        this.emoPercentage = 0;
      }
      console.log(this.emotionListService.getRecords());
      console.log(this.emotionListService.getType(this.emoTitle));
      this.prevEmoTitle = this.emotionListService.prevEmo(this.emoTitle);
      this.nextEmoTitle = this.emotionListService.nextEmo(this.emoTitle);
    });


  }

  ionViewWillEnter() {
    //This will update _emotions, which will then trigger the subscription of emotions in emotionService
    this.emotionsService.updateEmotionsFromServer();
  }

  // show insights modal
  async showInsightsModal() {
    const modal = await this.modalCtrl.create({
      component: InsightsPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        emo: this.emoTitle,
      },
    });
    await modal.present();
    modal.onDidDismiss().then((res) => {
      this.insights = res.data;
    });
  };

}
