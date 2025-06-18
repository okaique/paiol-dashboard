
export interface Manutencao {
  id: string;
  equipamento_id: string;
  empresa_id: string;
  tipo_id: string;
  data: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateManutencaoData {
  equipamento_id: string;
  empresa_id: string;
  tipo_id: string;
  data?: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}

export interface UpdateManutencaoData {
  id: string;
  empresa_id?: string;
  tipo_id?: string;
  data?: string;
  valor?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}
