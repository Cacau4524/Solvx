/**
 * O pagamento fica retido pela plataforma até o cliente confirmar a
 * conclusão do serviço — esse é o principal mecanismo de segurança do
 * lado financeiro (evita golpe tanto para cliente quanto para prestador).
 *
 *   PENDENTE → RETIDO → LIBERADO
 *                     ↘ REEMBOLSADO
 *                     ↘ EM_DISPUTA → (LIBERADO | REEMBOLSADO)
 */
export type PaymentStatus =
  | 'PENDENTE'
  | 'RETIDO'
  | 'LIBERADO'
  | 'REEMBOLSADO'
  | 'EM_DISPUTA';

export type PaymentMethod = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface Payment {
  id: number;
  serviceRequestId: number;
  valor: number;
  status: PaymentStatus;
  metodo: PaymentMethod;
  criadoEm: string;
  liberadoEm?: string;
  /** Taxa de comissão da plataforma, já descontada do valor repassado ao prestador. */
  taxaComissao: number;
  valorLiquidoPrestador: number;
}

export interface CreatePaymentPayload {
  serviceRequestId: number;
  metodo: PaymentMethod;
}

/** Aberta pelo cliente ou prestador quando há desacordo sobre o serviço concluído. */
export interface PaymentDispute {
  id: number;
  paymentId: number;
  abertaPor: 'cliente' | 'prestador';
  motivo: string;
  status: 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA';
  criadaEm: string;
  resolucao?: string;
}
