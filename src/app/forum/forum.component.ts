import { Component } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { IForumMenu } from 'src/app/services/interfaces/forum';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent {
  menuList:IForumMenu[];

  handleClick(topic){
    console.log(topic);
  }

  handleMenuObs(x:IForumMenu[]){
    this.menuList = x;
  }

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
  }

  constructor(private fs:ForumService){
    this.fs.getMenuObs().subscribe((x:IForumMenu[]) =>  {
      console.log("ForumMenuComponent >> getMenuObs()")
      this.handleMenuObs(x);
    });
  }
}
