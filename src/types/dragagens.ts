
export interface Dragagem {
  id: string;
  paiol_id: string;
  dragador_id: string;
  ajudante_id?: string;
  data_inicio: string;
  data_fim?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Cubagem {
  id: string;
  paiol_id: string;
  dragagem_id: string;
  medida_inferior: number;
  medida_superior: number;
  perimetro: number;
  volume_normal: number;
  volume_reduzido: number;
  data_cubagem: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}
