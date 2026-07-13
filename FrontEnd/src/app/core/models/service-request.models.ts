/**
 * Ciclo de vida de uma solicitação de serviço.
 *
 *   AGUARDANDO_ORCAMENTO → ACEITA → EM_ANDAMENTO → CONCLUIDA
 *                        ↘ RECUSADA          ↘ CANCELADA
 */
export type ServiceRequestStatus =
  | 'AGUARDANDO_ORCAMENTO'
  | 'ACEITA'
  | 'RECUSADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface ServiceRequestAddress {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/** Payload enviado pelo cliente ao criar uma nova solicitação. */
export interface CreateServiceRequestPayload {
  categoria: string;
  descricao: string;
  endereco: ServiceRequestAddress;
  dataPreferida?: string;
  fotos?: File[];
}

/**
 * Representa uma solicitação já existente, do ponto de vista de quem a
 * consulta (cliente vê a própria; prestador vê as que recebeu).
 */
export interface ServiceRequest {
  id: number;
  categoria: string;
  descricao: string;
  endereco: ServiceRequestAddress;
  status: ServiceRequestStatus;
  criadaEm: string;
  atualizadaEm: string;

  clienteId: number;
  clienteNome: string;

  prestadorId?: number;
  prestadorNome?: string;

  valorOrcado?: number;
  fotos?: string[]; // URLs, após upload

  /** Preenchido quando status é CONCLUIDA e o cliente já avaliou. */
  avaliacaoId?: number;
}

/** Resumo usado em listagens (histórico, cards) sem os detalhes completos. */
export interface ServiceRequestSummary {
  id: number;
  categoria: string;
  status: ServiceRequestStatus;
  criadaEm: string;
  outraParteNome: string; // nome do prestador (visão cliente) ou do cliente (visão prestador)
  valorOrcado?: number;
}
