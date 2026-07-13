import { ProviderStatus } from './auth.models';
import { ReviewSummary } from './review.models';

/**
 * Nível de verificação exibido publicamente. Diferente de `ProviderStatus`
 * (que controla acesso interno à plataforma), isso é o que o CLIENTE vê
 * no card do prestador — é a materialização do "diferencial de segurança"
 * da Solvy na hora da decisão de contratar.
 */
export interface VerificationBadge {
  cpfValidado: boolean;
  documentoValidado: boolean;
  antecedentesVerificados: boolean;
  /** true somente quando todos os itens acima são true. */
  totalmenteVerificado: boolean;
}

/** Dados públicos do prestador, exibidos em busca/perfil para o cliente. */
export interface ProviderProfile {
  id: number;
  nomeCompleto: string;
  fotoPerfilUrl?: string;
  categoriaPrincipal: string;
  especialidades: string;
  descricao: string;
  experiencia: string;
  precoMedio: number;
  cidadeAtuacao: string;
  raioAtendimento: number;

  status: ProviderStatus;
  verificacao: VerificationBadge;
  avaliacoes: ReviewSummary;

  /** Desde quando está ativo na plataforma (reforça confiança/histórico). */
  membroDesde: string;
}

export interface UpdateProviderProfilePayload {
  categoriaPrincipal?: string;
  especialidades?: string;
  descricao?: string;
  experiencia?: string;
  precoMedio?: number;
  cidadeAtuacao?: string;
  raioAtendimento?: number;
  fotoPerfil?: File;
}
