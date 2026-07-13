export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string; // cidade
  uf: string; // estado
  erro?: boolean;
}
