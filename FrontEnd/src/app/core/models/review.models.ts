/** Avaliação deixada pelo cliente após a conclusão de um serviço. */
export interface Review {
  id: number;
  serviceRequestId: number;
  prestadorId: number;
  clienteId: number;
  clienteNome: string;
  nota: 1 | 2 | 3 | 4 | 5;
  comentario: string;
  criadaEm: string;
  /** Resposta pública opcional do prestador à avaliação. */
  respostaPrestador?: string;
}

export interface CreateReviewPayload {
  serviceRequestId: number;
  nota: 1 | 2 | 3 | 4 | 5;
  comentario: string;
}

/** Agregado exibido no perfil do prestador (evita recalcular no front). */
export interface ReviewSummary {
  mediaNotas: number;
  totalAvaliacoes: number;
  distribuicao: Record<1 | 2 | 3 | 4 | 5, number>; // quantas avaliações em cada nota
}
