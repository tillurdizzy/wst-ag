import { Component } from '@angular/core';
import { IMeeting } from 'src/app/services/interfaces/hoa';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {
  meetings:IMeeting[] = [];
  obj:IMeeting = {date:"June 1, 2023",type:"Monthly",minutes:"<link>",zoom:"<link>"}

  ngOnInit(): void {
   this.meetings.push(this.obj)
  }
}
