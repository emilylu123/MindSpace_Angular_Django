import { ArticlePage } from './article/article';
import { ActivatedRoute, Routes, Router, RouterModule, NavigationExtras } from '@angular/router';
import { Component, OnInit, NgModule } from '@angular/core';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.page.html',
  styleUrls: ['./strategies.page.scss'],
})
export class StrategiesPage implements OnInit {
  loadedArticles: Article[];

  //index: number;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.loadedArticles = this.articleService.getAllArticles();
  }
}

