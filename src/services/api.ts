import axios from 'axios';
import { User, Subtopic, Post, AuthResponse, Comment, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Types
export interface AdminSubtopic extends Subtopic {
  posts: Post[];
}

export interface AdminStats {
  counts: {
    users: number;
    subtopics: number;
    posts: number;
    comments: number;
  };
  recentUsers: User[];
}

export const authAPI = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
};

export const subtopicsAPI = {
  getAll: () => api.get<Subtopic[]>('/subtopics'),
  getBySlug: (slug: string) => api.get<Subtopic>(`/subtopics/${slug}`),
  create: (data: { name: string; description: string }) =>
    api.post<Subtopic>('/subtopics', data),
};

export const postsAPI = {
  getAll: (subtopicId?: string, page?: number) =>
    api.get<Post[]>('/posts', { params: { subtopicId, page } }),
  create: (data: { title: string; content?: string; image?: string; subtopicId: string }) =>
    api.post<Post>('/posts', data),
  getById: (id: string) => api.get<Post>(`/posts/${id}`),
};

export const commentsAPI = {
  getByPost: (postId: string) => api.get<Comment[]>(`/comments/post/${postId}`),
  create: (data: { content: string; postId: string; parentId?: string }) =>
    api.post<Comment>('/comments', data),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export const adminAPI = {
  getSubtopics: () => api.get<AdminSubtopic[]>('/admin/subtopics'),
  deleteSubtopic: (id: string) => api.delete(`/admin/subtopics/${id}`),
  updateSubtopic: (id: string, data: { name: string; description: string }) =>
    api.put<Subtopic>(`/admin/subtopics/${id}`, data),
  getStats: () => api.get<AdminStats>('/admin/stats'),
};

export const usersAPI = {
  getMe: () => api.get<UserProfile>('/users/me'),
  getById: (id: string) => api.get<UserProfile>(`/users/${id}`),
  getSubtopics: (id: string) => api.get<Subtopic[]>(`/users/${id}/subtopics`),
  getPosts: (id: string, page?: number) => 
    api.get<Post[]>(`/users/${id}/posts`, { params: { page } }),
};