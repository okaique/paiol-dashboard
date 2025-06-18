
export interface Paiol {
  id: string;
  nome: string;
  localizacao: string;
  status: string;
  data_abertura?: string;
  data_fechamento?: string;
  ciclo_atual: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Fechamento {
  id: string;
  paiol_id: string;
  data_fechamento: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricoStatusPaiol {
  id: string;
  paiol_id: string;
  status_anterior?: string;
  status_novo: string;
  data_mudanca: string;
  observacoes?: string;
  usuario_id?: string;
}

export type StatusPaiol = 'VAZIO' | 'DRAGANDO' | 'CHEIO' | 'RETIRANDO';

export interface StatusTransition {
  from: StatusPaiol;
  to: StatusPaiol;
  requiresDragador?: boolean;
  requiresAjudante?: boolean;
}
