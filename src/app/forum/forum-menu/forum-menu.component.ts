import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';


@Component({
  selector: 'app-forum-menu',
  templateUrl: './forum-menu.component.html',
  styleUrls: ['./forum-menu.component.scss'],
})

export class ForumMenuComponent implements OnInit{

  @Input() data = null; //[{id:0,created_at:"",title:"",subTitle:""}]

  handleClick(topicID:number){
    console.log("ForumMenuComponent >> handleClick() " + topicID);
    this.supabase.getForumTopic(topicID);
  }

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
  }

  constructor(private supabase: SupabaseService){
   
  }
}
