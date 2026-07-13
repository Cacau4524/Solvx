import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReviewPayload, Review, ReviewSummary } from '../models/review.models';
import { API_BASE_URL } from '../config/api.config';

const API_BASE = `${API_BASE_URL}/reviews`;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  create(payload: CreateReviewPayload): Observable<Review> {
    return this.http.post<Review>(API_BASE, payload);
  }

  listForProvider(prestadorId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_BASE}/prestador/${prestadorId}`);
  }

  getSummaryForProvider(prestadorId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${API_BASE}/prestador/${prestadorId}/resumo`);
  }
}
