import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EmotionsComponent } from './emotions.component';
import { Injectable, Input } from '@angular/core';
import { Emotion } from './emotion.model';
import { Record } from './record.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionsService {
  // Use BehaviorSubject for making _emotions observable
  private _emotions = new BehaviorSubject<Record[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  updateEmotionsFromServer() {
    this.http
      .get(this.authService.djangoUrl + 'api/record/emotions')
      .pipe(take(1))
      .subscribe((records: Record[]) => {
        console.log(records);
        this._emotions.next(records);
      });
  }

  get emotions() {
    // Return this._emotions observable for subsciption
    return this._emotions.asObservable();
  }
}
