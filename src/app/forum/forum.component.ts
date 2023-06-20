import { Component } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { IForumMenu,IForumTopic, IForumPost } from 'src/app/services/interfaces/forum';
import { SupabaseService } from '../services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})

export class ForumComponent {
  view:string = 'menu';
  menuList:IForumMenu[];
  topicList:IForumTopic[];
  postList:IForumPost[];

  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;
  subscriptionThree: Subscription;

  topicHeader:string;

  handleClick(topic){
    console.log(topic);
    this.topicHeader = topic;
  }

  navToMenu(){this.view = "menu"}

  handleMenuObs(x:IForumMenu[]){
    this.view = "menu"
    this.menuList = x;
  }

  handleTopicObs(x:IForumTopic[]){
    this.view = "topic"
    this.topicList = x;
  }

  handlePostObs(x:IForumPost[]){
    this.view = "post"
    this.postList = x;
  }

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
    this.supabase.getForumMenu();
  }
  ngOnDestroy(): void {
    this.subscriptionOne.unsubscribe();
    this.subscriptionTwo.unsubscribe();
    this.subscriptionThree.unsubscribe();
  }

  constructor(private fs:ForumService, private supabase:SupabaseService){
    
    this.subscriptionOne = this.fs.getMenuObs().subscribe((x:IForumMenu[]) =>  {
      console.log("ForumMenuComponent >> getMenu-Obs()")
      this.handleMenuObs(x);
    });

    this.subscriptionTwo = this.fs.getTopicObs().subscribe((x:IForumTopic[]) =>  {
      console.log("ForumMenuComponent >> getTopic-Obs()")
      this.handleTopicObs(x);
    });

    this.subscriptionThree = this.fs.getPostObs().subscribe((x:IForumPost[]) =>  {
      console.log("ForumMenuComponent >> getPost-Obs()")
      this.handlePostObs(x);
    });
  }
}
