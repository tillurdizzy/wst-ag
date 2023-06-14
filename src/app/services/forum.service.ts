import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription, BehaviorSubject } from 'rxjs'
import { IForumMenu, IForumTopic } from 'src/app/services/interfaces/forum';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})

export class ForumService {
  private supaSubscription: Subscription

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
  ngOnDestroy(): void {
    this.supaSubscription.unsubscribe();
  }
 

  constructor(private supabase:SupabaseService) {
    console.log("ForumService >> constructor()")
    this.supaSubscription = this.supabase.getData().subscribe(x =>{
      if(x == null){return};
      let dataPassed = x;
      let to = dataPassed.to;
      if(to == "ForumService"){
        if(dataPassed.event == 'getForumMenu'){
          this.setMenuObs(dataPassed.result)
        }else if(dataPassed.event == 'getForumTopic'){
          this.setTopicObs(dataPassed.result)
        }
      }
    }); //! End Of supaSubscription
   }
}
