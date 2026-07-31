import { api } from './api';
import { User, AuthTokens } from '../types/auth';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
  },

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  async loginWithGoogle(credential: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<AuthTokens>('/auth/google', { credential });
    const tokens = response.data;
    this.setTokens(tokens);

    // Fetch user details with the newly acquired token
    const user = await this.getCurrentUser();
    return { user, tokens };
  },

  async loginWithCredentials(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<AuthTokens>('/auth/login', { email, password });
    const tokens = response.data;
    this.setTokens(tokens);

    const user = await this.getCurrentUser();
    return { user, tokens };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout endpoint notification:', e);
    } finally {
      this.clearTokens();
    }
  }
};
