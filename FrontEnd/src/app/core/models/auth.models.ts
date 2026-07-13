export type UserRole = 'cliente' | 'prestador';
export type ProviderStatus = 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';
export type Genero = 'masculino' | 'feminino' | 'nao_informar' | 'outro';

export interface ClientUser {
  id: number;
  role: 'cliente';
  nomeCompleto: string;
  email: string;
}

export interface ProviderUser {
  id: number;
  role: 'prestador';
  nomeCompleto: string;
  email: string;
  status: ProviderStatus;
  motivoReprovacao?: string;
}

export type AuthUser = ClientUser | ProviderUser;

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ClientRegisterRequest {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  dataNascimento: string;
  genero: Genero;
  senha: string;
}

/** Etapa 1 do cadastro de prestador. */
export interface ProviderPersonalData {
  nomeCompleto: string;
  cpf: string;
  rg?: string;
  dataNascimento: string;
  genero: Genero;
  telefone: string;
  email: string;
  senha: string;
}

/** Etapa 2 do cadastro de prestador. */
export interface ProviderAddress {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/** Etapa 3 do cadastro de prestador. */
export interface ProviderProfessionalInfo {
  categoriaPrincipal: string;
  especialidades: string;
  descricao: string;
  experiencia: string;
  precoMedio: number | null;
  cidadeAtuacao: string;
  raioAtendimento: number | null;
  fotoPerfil: File | null;
  fotoDocumento: File | null;
  curriculo: File | null;
}

export interface ProviderRegisterRequest {
  dadosPessoais: ProviderPersonalData;
  endereco: ProviderAddress;
  informacoesProfissionais: Omit<ProviderProfessionalInfo, 'fotoPerfil' | 'fotoDocumento' | 'curriculo'>;
}
