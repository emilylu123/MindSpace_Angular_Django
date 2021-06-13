import { take, map, tap, switchMap } from 'rxjs/operators';
import { Article } from './article.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable, interval } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articlesList: Article[];

  private articles: Article[] = [
    {
      id: '001',
      title: 'Beyond Blue',
      shortContent: 'Anxiety, depression and suicide prevention',
      content:
        'https://www.beyondblue.org.au/',
      tag: 'Excitement',
      type: 'fear',
      imgPath: '../../assets/strategiesImage/Excitement1.jpeg',
    },
    {
      id: '002',
      title: "Kids' helpline",
      shortContent: 'Phone counselling service',
      content:
        'https://kidshelpline.com.au/',
      tag: 'Peace',
      type: 'happy',
      imgPath: '../../assets/strategiesImage/Peace1.jpeg',

    },
    {
      id: '003',
      title: 'R u okay?',
      shortContent:  'Conversation could change life',
      content:
        'https://www.ruok.org.au/',
      tag: 'Panic',
      type: 'fear',
      imgPath: '../../assets/strategiesImage/Panic1.jpeg',

    },
    {
      id: '004',
      title: 'Managing anger',
      shortContent:
        "MensLine's Australia",
      content:
        'https://mensline.org.au/how-to-deal-with-anger/managing-anger/',
      tag: 'Anger',
      type: 'anger',
      imgPath: '../../assets/strategiesImage/Dislike1.jpeg'
    },
    {
      id: '005',
      title: 'Black dog institute',
      shortContent: 'Science. Compassion. Action',
      content:
        'https://www.blackdoginstitute.org.au/ ',
      tag: 'Excitement',
      type: 'fear',
      imgPath: '../../assets/strategiesImage/Excitement1.jpeg',
    },

    {
      id: '002',
      title: "Australian centre ",
      shortContent: 'grief and bereavement',
      content:'https://www.grief.org.au/ ',
      tag: 'Joy',
      type: 'happy',
      imgPath: '../../assets/strategiesImage/Peace1.jpeg',

    },
  ];


  constructor() { }

  getAllArticles() {
    return [...this.articles];
  }

  getArticle(articleID: string) {
    return {
      ...this.articles.find(article => {
        return article.id === articleID;
      })
    };
  }
}
