export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
    subtopics: number;
  };
}

export interface UserProfile extends User {
  _count: {
    posts: number;
    comments: number;
    subtopics: number;
  };
}

export interface Subtopic {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
  };
  _count: {
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  subtopic: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    comments: number;
    votes: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  postId: string;
  parentId?: string;
  replies: Comment[];
  _count: {
    replies: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}