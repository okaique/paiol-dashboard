
export type AppRole = 'administrador' | 'operador' | 'visualizador';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by?: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole {
  user_id: string;
  email: string;
  nome: string;
  role: AppRole;
  assigned_at?: string;
  created_at: string;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  administrador: 'Administrador',
  operador: 'Operador',
  visualizador: 'Visualizador'
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  administrador: 'Acesso total ao sistema, pode gerenciar usuários e todas as funcionalidades',
  operador: 'Pode criar, editar e excluir dados, mas não gerenciar usuários',
  visualizador: 'Apenas visualização dos dados, sem permissões de edição'
};

export const ROLE_PERMISSIONS = {
  administrador: {
    canManageUsers: true,
    canEditData: true,
    canViewData: true,
    canDeleteData: true,
    canManageSettings: true
  },
  operador: {
    canManageUsers: false,
    canEditData: true,
    canViewData: true,
    canDeleteData: true,
    canManageSettings: false
  },
  visualizador: {
    canManageUsers: false,
    canEditData: false,
    canViewData: true,
    canDeleteData: false,
    canManageSettings: false
  }
};
