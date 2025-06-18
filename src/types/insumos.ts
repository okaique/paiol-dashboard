
export interface TipoInsumo {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface GastoInsumo {
  id: string;
  dragagem_id: string;
  tipo_insumo_id: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  data_gasto: string;
  fornecedor?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export type CategoriaInsumo = 'COMBUSTIVEL' | 'OLEO' | 'FILTRO' | 'LUBRIFICANTE' | 'MANUTENCAO' | 'OUTROS';
export type UnidadeMedida = 'LITRO' | 'KG' | 'UNIDADE' | 'METRO';
