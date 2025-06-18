
export interface EmpresaMecanica {
  id: string;
  nome: string;
  contato?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmpresaMecanicaData {
  nome: string;
  contato?: string;
  ativo?: boolean;
}

export interface UpdateEmpresaMecanicaData {
  id: string;
  nome?: string;
  contato?: string;
  ativo?: boolean;
}
