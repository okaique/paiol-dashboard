
export interface TipoGasto {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface GastoGeral {
  id: string;
  equipamento_id: string;
  tipo_id: string;
  data: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
  created_at: string;
  updated_at: string;
}

export type CreateTipoGastoData = {
  nome: string;
  ativo?: boolean;
};

export type UpdateTipoGastoData = {
  id: string;
  nome?: string;
  ativo?: boolean;
};

export type CreateGastoGeralData = {
  equipamento_id: string;
  tipo_id: string;
  data: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
};

export type UpdateGastoGeralData = {
  id: string;
  equipamento_id?: string;
  tipo_id?: string;
  data?: string;
  valor?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
};
