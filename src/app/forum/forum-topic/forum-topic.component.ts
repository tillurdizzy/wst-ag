import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-forum-topic',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.scss']
})
export class ForumTopicComponent implements OnInit{
  @Input() data = null;

  ngOnInit(): void {
    console.log("ForumMenuComponent >> ngOnInit()")
  }

  topicHeaderClick(x){

  }

  constructor(private supabase: SupabaseService){
   
  }
}
