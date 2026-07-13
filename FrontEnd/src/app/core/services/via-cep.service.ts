import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ViaCepResponse } from '../models/via-cep.models';

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  private readonly http = inject(HttpClient);

  /** Busca o endereço a partir de um CEP (somente dígitos ou já formatado). */
  lookup(cep: string): Observable<ViaCepResponse | null> {
    const digits = cep.replace(/\D/g, '');
    return this.http
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${digits}/json/`)
      .pipe(map((res) => (res.erro ? null : res)));
  }
}
