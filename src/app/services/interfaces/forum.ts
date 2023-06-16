export interface IForumMenu {
  id: number;
  created_at: string;
  title: string;
  subTitle: string;
}

export interface IForumTopic {
  id: number;
  created_at: string;
  user: string;
  topic: string;
  title: string;
  body: string;
  likes: number;
  dislikes: number;
}

export interface IForumPost {
  id: number;
  created_at: string;
  user_id: string;
  topic_id: string;
  body: string;
  likes: number;
}


