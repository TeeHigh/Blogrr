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
  token: string;
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
  token: string;
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