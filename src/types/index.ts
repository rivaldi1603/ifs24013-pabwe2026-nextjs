export interface ApiResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface PostAuthor {
  id: number;
  name: string;
  avatar?: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  author: PostAuthor;
  comment: string;
  created_at: string;
  is_me: boolean;
}

export interface Post {
  id: number;
  description: string;
  cover?: string;
  author: PostAuthor;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_me: boolean;
  created_at: string;
  updated_at: string;
  comments?: PostComment[];
}

export interface AuthLoginResponse {
  token: string;
  user: User;
}
