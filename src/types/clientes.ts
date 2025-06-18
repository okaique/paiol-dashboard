
export interface Cliente {
  id: string;
  nome: string;
  cpf_cnpj?: string;
  tipo_pessoa: 'FISICA' | 'JURIDICA';
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Caminhao {
  id: string;
  placa: string;
  modelo?: string;
  marca?: string;
  ano?: number;
  capacidade_m3?: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type TipoPessoaCliente = 'FISICA' | 'JURIDICA';
