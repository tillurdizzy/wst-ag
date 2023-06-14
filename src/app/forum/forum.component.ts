import { Component } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { IForumMenu,IForumTopic } from 'src/app/services/interfaces/forum';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent {
  view:string = 'menu';
  menuList:IForumMenu[];
  topicList:IForumTopic[];

  handleClick(topic){
    console.log(topic);
  }

  handleMenuObs(x:IForumMenu[]){
    this.view = "menu"
    this.menuList = x;
  }

  handleTopicObs(x:IForumTopic[]){
    this.view = "topic"
    this.topicList = x;
  }

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
    this.supabase.getForumMenu();
  }

  constructor(private fs:ForumService, private supabase:SupabaseService){
    this.fs.getMenuObs().subscribe((x:IForumMenu[]) =>  {
      console.log("ForumMenuComponent >> getMenuObs()")
      this.handleMenuObs(x);
    });

    this.fs.getTopicObs().subscribe((x:IForumTopic[]) =>  {
      console.log("ForumMenuComponent >> getTopicObs()")
      this.handleTopicObs(x);
    });
  }
}
