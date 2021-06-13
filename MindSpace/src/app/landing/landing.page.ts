import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  constructor(private route: Router) {}

  ngOnInit() {}

  onClickStart() {
    this.route.navigateByUrl('auth');
  }
}
