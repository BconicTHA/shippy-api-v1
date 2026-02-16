export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  password: string;
  usertype: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  usertype: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    usertype: string;
    address: string;
    phone: string;
  };
  access_token: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  name: string;
  usertype: string;
  iat: number;
  exp: number;
}