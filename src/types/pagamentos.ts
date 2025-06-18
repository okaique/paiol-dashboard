
export interface PagamentoPessoal {
  id: string;
  dragagem_id: string;
  pessoa_id: string;
  tipo_pessoa: 'DRAGADOR' | 'AJUDANTE';
  tipo_pagamento: 'ADIANTAMENTO' | 'PAGAMENTO_FINAL';
  valor: number;
  data_pagamento: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export type TipoPagamento = 'ADIANTAMENTO' | 'PAGAMENTO_FINAL';
