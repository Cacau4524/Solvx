import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'solvy_access_token';
const REFRESH_TOKEN_KEY = 'solvy_refresh_token';
const USER_KEY = 'solvy_user';

/**
 * Centraliza a leitura/escrita dos dados de sessão no localStorage.
 * Isolar isso em um serviço facilita trocar a estratégia de armazenamento
 * no futuro (ex.: cookies httpOnly) sem tocar no resto da aplicação.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  saveSession(accessToken: string, refreshToken: string, user: AuthUser): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  updateTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  updateUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
