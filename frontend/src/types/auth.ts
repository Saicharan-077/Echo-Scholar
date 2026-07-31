export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  username?: string | null;
  role: 'user' | 'admin' | string;
  is_active: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface GoogleAuthResponse {
  credential: string;
}
