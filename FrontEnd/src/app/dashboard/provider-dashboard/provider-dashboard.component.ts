import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { ServiceRequestSummary } from '../../core/models/service-request.models';
import { ReviewSummary } from '../../core/models/review.models';
import { VerificationBadge } from '../../core/models/provider-profile.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, StatusBadgeComponent],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.scss',
})
export class ProviderDashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly serviceRequestService = inject(ServiceRequestService);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(true);
  readonly requests = signal<ServiceRequestSummary[]>([]);

  readonly recebidas = computed(() => this.requests().filter((r) => r.status === 'AGUARDANDO_ORCAMENTO'));
  readonly emAndamento = computed(() => this.requests().filter((r) => r.status === 'ACEITA' || r.status === 'EM_ANDAMENTO'));
  readonly concluidas = computed(() => this.requests().filter((r) => r.status === 'CONCLUIDA'));

  // Em produção isso viria de ProviderProfileService + ReviewService, a partir
  // do backend. Mantido local por enquanto para a tela já ficar navegável.
  readonly verificacao = signal<VerificationBadge>({
    cpfValidado: true,
    documentoValidado: true,
    antecedentesVerificados: true,
    totalmenteVerificado: true,
  });

  readonly avaliacoes = signal<ReviewSummary>({
    mediaNotas: 4.8,
    totalAvaliacoes: 32,
    distribuicao: { 5: 26, 4: 4, 3: 1, 2: 1, 1: 0 },
  });

  ngOnInit(): void {
    this.serviceRequestService.listReceivedRequests().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        // Sem backend ainda: dados de exemplo para visualização.
        this.requests.set(this.mockData());
        this.isLoading.set(false);
      },
    });
  }

  accept(id: number): void {
    const valor = Number(prompt('Valor do orçamento (R$):', '150'));
    if (!valor) return;

    this.serviceRequestService.acceptRequest(id, valor).subscribe({
      next: () => this.updateLocalStatus(id, 'ACEITA'),
      error: () => {
        // Modo demonstração sem backend.
        this.updateLocalStatus(id, 'ACEITA');
        this.snackBar.open('(Modo demonstração) Solicitação aceita.', 'Fechar', { duration: 3500 });
      },
    });
  }

  reject(id: number): void {
    this.serviceRequestService.rejectRequest(id).subscribe({
      next: () => this.updateLocalStatus(id, 'RECUSADA'),
      error: () => {
        this.updateLocalStatus(id, 'RECUSADA');
        this.snackBar.open('(Modo demonstração) Solicitação recusada.', 'Fechar', { duration: 3500 });
      },
    });
  }

  private updateLocalStatus(id: number, status: ServiceRequestSummary['status']): void {
    this.requests.update((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  private mockData(): ServiceRequestSummary[] {
    return [
      { id: 10, categoria: 'Elétrica', status: 'AGUARDANDO_ORCAMENTO', criadaEm: '2026-07-10', outraParteNome: 'Fernanda Lima' },
      { id: 11, categoria: 'Elétrica', status: 'AGUARDANDO_ORCAMENTO', criadaEm: '2026-07-09', outraParteNome: 'Ricardo Alves' },
      { id: 12, categoria: 'Elétrica', status: 'EM_ANDAMENTO', criadaEm: '2026-07-05', outraParteNome: 'Patrícia Souza', valorOrcado: 180 },
      { id: 13, categoria: 'Elétrica', status: 'CONCLUIDA', criadaEm: '2026-06-18', outraParteNome: 'Bruno Costa', valorOrcado: 210 },
    ];
  }
}
