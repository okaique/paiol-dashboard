
export interface Abastecimento {
  id: string;
  equipamento_id: string;
  data: string;
  valor: number;
  litragem: number;
  km_atual?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAbastecimentoData {
  equipamento_id: string;
  data?: string;
  valor: number;
  litragem: number;
  km_atual?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}

export interface UpdateAbastecimentoData {
  id: string;
  data?: string;
  valor?: number;
  litragem?: number;
  km_atual?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}
