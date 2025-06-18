
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}
