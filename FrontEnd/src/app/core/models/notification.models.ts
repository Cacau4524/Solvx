export type NotificationType =
  | 'CADASTRO_APROVADO'
  | 'CADASTRO_REPROVADO'
  | 'NOVA_SOLICITACAO'
  | 'SOLICITACAO_ACEITA'
  | 'SOLICITACAO_RECUSADA'
  | 'SERVICO_CONCLUIDO'
  | 'PAGAMENTO_LIBERADO'
  | 'NOVA_AVALIACAO';

export interface AppNotification {
  id: number;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
  /** Rota para onde a notificação deve levar ao ser clicada. */
  link?: string;
}
