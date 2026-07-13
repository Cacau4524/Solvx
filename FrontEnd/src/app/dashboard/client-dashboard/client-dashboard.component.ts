import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/services/auth.service';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ServiceRequestSummary } from '../../core/models/service-request.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

const ATIVOS = new Set(['AGUARDANDO_ORCAMENTO', 'ACEITA', 'EM_ANDAMENTO']);

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTabsModule, StatusBadgeComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
})
export class ClientDashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly serviceRequestService = inject(ServiceRequestService);

  readonly isLoading = signal(true);
  readonly requests = signal<ServiceRequestSummary[]>([]);

  readonly ativos = computed(() => this.requests().filter((r) => ATIVOS.has(r.status)));
  readonly historico = computed(() => this.requests().filter((r) => !ATIVOS.has(r.status)));

  ngOnInit(): void {
    this.serviceRequestService.listMyRequests().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        // Sem backend ainda: usa dados de exemplo para você visualizar a tela.
        // Remova este fallback assim que a API estiver disponível.
        this.requests.set(this.mockData());
        this.isLoading.set(false);
      },
    });
  }

  private mockData(): ServiceRequestSummary[] {
    return [
      { id: 1, categoria: 'Elétrica', status: 'EM_ANDAMENTO', criadaEm: '2026-07-05', outraParteNome: 'João Eletricista', valorOrcado: 180 },
      { id: 2, categoria: 'Pintura', status: 'AGUARDANDO_ORCAMENTO', criadaEm: '2026-07-08', outraParteNome: '—' },
      { id: 3, categoria: 'Hidráulica', status: 'CONCLUIDA', criadaEm: '2026-06-20', outraParteNome: 'Marcos Encanador', valorOrcado: 220 },
      { id: 4, categoria: 'Jardinagem', status: 'CANCELADA', criadaEm: '2026-06-10', outraParteNome: 'Ana Jardins' },
    ];
  }
}
