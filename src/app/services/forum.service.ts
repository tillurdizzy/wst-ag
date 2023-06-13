import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IForumMenu, IForumTopic } from 'src/app/services/interfaces/forum';

@Injectable({
  providedIn: 'root'
})

export class ForumService {

  //* Menu
  private menuObs$: BehaviorSubject<[]> = new BehaviorSubject(null);

  getMenuObs(): Observable<[]> {
      return this.menuObs$.asObservable();
  }

  setMenuObs(m) {
      this.menuObs$.next(m);
  }

  //* Topic
  private topicObs$: BehaviorSubject<IForumTopic[]> = new BehaviorSubject(null);

  getTopicObs(): Observable<IForumTopic[]> {
      return this.topicObs$.asObservable();
  }

  setTopicObs(t: IForumTopic[]) {
      this.topicObs$.next(t);
  }
 

  constructor() { }
}
