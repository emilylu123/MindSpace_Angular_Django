import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StrategiesPage } from './../strategies.page';
import { ArticlePage, } from './../article/article';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { Article } from './../article.model';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-article-list-item',
  templateUrl: './article-list-item.component.html',
  styleUrls: ['./article-list-item.component.scss'],
})
export class ArticleListItemComponent implements OnInit {

  @Input() ArticleListItem: Article;

  constructor(public modalCtrl: ModalController, private routerOutlet: IonRouterOutlet, private inAppBrowser: InAppBrowser) { }


  ngOnInit() { }

  openPage(url: string) {
    window.open(url, '_blank');
  }
  /*
  // show webview modal
  async showWebviewModal() {
    const modal = await this.modalCtrl.create({
      component: ArticlePage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  };
  */
}
