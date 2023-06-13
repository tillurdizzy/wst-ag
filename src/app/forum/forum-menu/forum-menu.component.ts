import { Component, OnInit } from '@angular/core';
import { Input, Output} from '@angular/core';
import { IForumMenu } from 'src/app/services/interfaces/forum';

@Component({
  selector: 'app-forum-menu',
  templateUrl: './forum-menu.component.html',
  styleUrls: ['./forum-menu.component.scss'],
})

export class ForumMenuComponent implements OnInit{

  @Input() data = null; //[{id:0,created_at:"",title:"",subTitle:""}]

  handleClick(topic){
    console.log(topic);
  }

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
  }

  constructor(){
   
  }
}
