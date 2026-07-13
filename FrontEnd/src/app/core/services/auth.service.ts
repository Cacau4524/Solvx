import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  AuthUser,
  ClientRegisterRequest,
  LoginRequest,
  ProviderRegisterRequest,
  ProviderUser,
  RefreshResponse,
} from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

import { API_BASE_URL } from '../config/api.config';

// Ponto de extensão: troque pela URL real da API quando o backend estiver disponível.
const API_BASE = `${API_BASE_URL}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly _currentUser = signal<AuthUser | null>(this.tokenStorage.getUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isClient = computed(() => this._currentUser()?.role === 'cliente');
  readonly isProvider = computed(() => this._currentUser()?.role === 'prestador');

  // ---------- Cliente ----------

  loginClient(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE}/client/login`, credentials)
      .pipe(tap((res) => this.persistSession(res)));
  }

  registerClient(payload: ClientRegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE}/client/register`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  // ---------- Prestador ----------

  loginProvider(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE}/provider/login`, credentials)
      .pipe(tap((res) => this.persistSession(res)));
  }

  registerProvider(payload: ProviderRegisterRequest): Observable<AuthResponse> {
    // Em produção isso normalmente seria enviado como multipart/form-data
    // (por causa dos arquivos de foto/documento/currículo). A camada de
    // montagem do FormData fica no componente de cadastro, que injeta este
    // serviço — aqui mantemos a assinatura simples para o corpo JSON.
    return this.http
      .post<AuthResponse>(`${API_BASE}/provider/register`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  /** Atualiza localmente o status do prestador (ex.: após consultar a API novamente). */
  updateProviderStatus(user: ProviderUser): void {
    this._currentUser.set(user);
    this.tokenStorage.updateUser(user);
  }

  // ---------- Sessão / Token ----------

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.http.post<RefreshResponse>(`${API_BASE}/refresh`, { refreshToken }).pipe(
      tap((res) => this.tokenStorage.updateTokens(res.accessToken, res.refreshToken))
    );
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  logout(): void {
    this.tokenStorage.clear();
    this._currentUser.set(null);
  }

  private persistSession(response: AuthResponse): void {
    this.tokenStorage.saveSession(response.accessToken, response.refreshToken, response.user);
    this._currentUser.set(response.user);
  }
}
