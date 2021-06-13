import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';
import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.html',
  styleUrls: ['./article.scss'],
})
export class ArticlePage implements OnInit {
  loadedArticle: Article;
  private myTemplate: any = "";


  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router,
    private inAppBrowser: InAppBrowser,
    private modalCtrl: ModalController,

  ) {

    //console.log(this)
  }

  ngOnInit() {
    /*
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('articleID')) {
        this.router.navigate(['/articles']);
        return;
      }
      const articleID = paramMap.get('articleID');
      this.loadedArticle = this.articleService.getArticle(articleID);
    });
  }
  */
    //this.inAppBrowser.create('https://ionicframework.com/','_blank');
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
