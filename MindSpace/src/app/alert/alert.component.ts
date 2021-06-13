import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(public alertController: AlertController, private route: Router) {}

  ngOnInit() {}

  async sentAlert(permissionHeader: string) {
    console.log('in alert sentAlert()');
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Allow Access',
      subHeader: permissionHeader,
      message: 'MindSpace need some permissions to analyse your emotions',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Allow',
          handler: () => {
            console.log('Confirm Okay');
            this.route.navigateByUrl('/main/tabs/home');
          },
        },
      ],
    });

    await alert.present();
  }
}
