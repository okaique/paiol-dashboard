
export interface TipoManutencao {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTipoManutencaoData {
  nome: string;
  ativo?: boolean;
}

export interface UpdateTipoManutencaoData {
  id: string;
  nome?: string;
  ativo?: boolean;
}
