import { LucideIcon } from "lucide-react";

export interface APIError {
  detail: string;
}

export interface User {
  fullname: string;
  username: string;
  email: string;
  avatar?: CloudinaryUploadResponse | null;
  role: "author" | "admin";
  genres?: string[];
  bio?: string;
}

export type RegisterFormData = {
  fullname: string;
  username: string;
  password: string;
  email: string;
  avatar?: CloudinaryUploadResponse | null;
  genres: string[];
  bio: string;
};

export interface RegisterResponse {
  user: {
    id: string;
    fullname: string;
    email: string;
    username: string;
    avatar?: CloudinaryUploadResponse | null;
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
    avatar?: CloudinaryUploadResponse | null;
    role: "author" | "admin";
    genres?: string[];
    bio?: string;
    emailVerified: boolean;
  };
  access: string;
  refresh: string;
}

export type CloudinaryUploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages?: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
  api_key?: string;
};

export interface DashboardResponse{
  author: User;
  blogs: BlogPost[];
  // comments: Comment[];
  // likes: Like[];
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
  author_avatar: CloudinaryUploadResponse | null;
  created_at?: string;  
  updated_at?: string;
  published_at?: string | null;
  tags: string[];
  readTime: number;
  status: "draft" | "published";
  coverImage?: string;
}

export interface DashboardStat {
  name: string;
  value: string;
  icon: LucideIcon | any;
  color: string;
}