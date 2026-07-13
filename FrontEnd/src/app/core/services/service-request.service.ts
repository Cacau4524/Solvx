import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateServiceRequestPayload,
  ServiceRequest,
  ServiceRequestSummary,
} from '../models/service-request.models';
import { API_BASE_URL } from '../config/api.config';

const API_BASE = `${API_BASE_URL}/service-requests`;

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private readonly http = inject(HttpClient);

  // ---------- Cliente ----------

  createRequest(payload: CreateServiceRequestPayload): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(API_BASE, payload);
  }

  listMyRequests(): Observable<ServiceRequestSummary[]> {
    return this.http.get<ServiceRequestSummary[]>(`${API_BASE}/me`);
  }

  cancelRequest(id: number): Observable<void> {
    return this.http.post<void>(`${API_BASE}/${id}/cancelar`, {});
  }

  // ---------- Prestador ----------

  listReceivedRequests(): Observable<ServiceRequestSummary[]> {
    return this.http.get<ServiceRequestSummary[]>(`${API_BASE}/recebidas`);
  }

  acceptRequest(id: number, valorOrcado: number): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${API_BASE}/${id}/aceitar`, { valorOrcado });
  }

  rejectRequest(id: number): Observable<void> {
    return this.http.post<void>(`${API_BASE}/${id}/recusar`, {});
  }

  markAsCompleted(id: number): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${API_BASE}/${id}/concluir`, {});
  }

  getById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${API_BASE}/${id}`);
  }
}
