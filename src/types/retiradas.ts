
export interface Retirada {
  id: string;
  paiol_id: string;
  cliente_id: string;
  caminhao_id?: string;
  data_retirada: string;
  volume_retirado: number;
  valor_unitario?: number;
  valor_total?: number;
  motorista_nome?: string;
  motorista_cpf?: string;
  placa_informada?: string;
  tem_frete: boolean;
  valor_frete?: number;
  caminhao_frete_id?: string;
  status_pagamento: 'PAGO' | 'NAO_PAGO';
  data_pagamento?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export type StatusPagamento = 'PAGO' | 'NAO_PAGO';
