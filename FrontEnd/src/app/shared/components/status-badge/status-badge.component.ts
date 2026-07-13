import { Component, Input } from '@angular/core';
import { ServiceRequestStatus } from '../../../core/models/service-request.models';

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  AGUARDANDO_ORCAMENTO: 'Aguardando orçamento',
  ACEITA: 'Aceita',
  RECUSADA: 'Recusada',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};

const STATUS_TONES: Record<ServiceRequestStatus, 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
  AGUARDANDO_ORCAMENTO: 'amber',
  ACEITA: 'blue',
  RECUSADA: 'red',
  EM_ANDAMENTO: 'blue',
  CONCLUIDA: 'green',
  CANCELADA: 'gray',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="'status-badge--' + tone">{{ label }}</span>`,
  styles: [`
    .status-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 11px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .status-badge--blue { background: rgba(37,99,235,0.1); color: #2563EB; }
    .status-badge--green { background: rgba(122,201,67,0.14); color: #4A7F15; }
    .status-badge--amber { background: rgba(245,166,35,0.14); color: #B57907; }
    .status-badge--red { background: rgba(217,48,37,0.1); color: #D93025; }
    .status-badge--gray { background: rgba(102,112,133,0.12); color: #667085; }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: ServiceRequestStatus;

  get label(): string {
    return STATUS_LABELS[this.status];
  }

  get tone(): string {
    return STATUS_TONES[this.status];
  }
}
