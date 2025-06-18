
export interface Dragador {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  valor_diaria?: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ajudante {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  valor_diaria?: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export type TipoPessoa = 'DRAGADOR' | 'AJUDANTE';
