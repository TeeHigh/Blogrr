export interface APIError {
  detail: string;
}

export interface User {
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
  role: "author" | "admin";
  genres?: string[];
  bio?: string;
}

export type RegisterFormData = {
  fullname: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  genres: string[];
  bio: string;
};

export interface RegisterResponse {
  user: {
    id: string;
    fullname: string;
    email: string;
    username: string;
    avatar?: string;
    role: "author" | "admin";
    genres?: string[];
    bio?: string;
    emailVerified: boolean;
  };
  access_token: string;
  refresh_token: string;
}

export type LoginInput = {
  email: string;
  password: string;
};

export interface LoginResponse {
  user: {
    id: string;
    fullname: string;
    email: string;
    username: string;
    avatar?: string;
    role: "author" | "admin";
    genres?: string[];
    bio?: string;
    emailVerified: boolean;
  };
  access: string;
  refresh: string;
}

export interface AddPostFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  readTime: number;
  status: "draft" | "published";
  coverImage: string | undefined;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_avatar: string;
  created_at?: string;  
  updated_at?: string;
  published_at?: string | null;
  tags: string[];
  readTime: number;
  status: "draft" | "published";
  coverImage?: string;
}