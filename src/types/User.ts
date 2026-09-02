export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'alumni';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}