export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      abastecimentos: {
        Row: {
          anexos: string[] | null
          created_at: string
          data: string
          equipamento_id: string
          id: string
          km_atual: number | null
          litragem: number
          observacoes: string | null
          responsavel: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          equipamento_id: string
          id?: string
          km_atual?: number | null
          litragem?: number
          observacoes?: string | null
          responsavel?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          equipamento_id?: string
          id?: string
          km_atual?: number | null
          litragem?: number
          observacoes?: string | null
          responsavel?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "abastecimentos_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      ajudantes: {
        Row: {
          ativo: boolean | null
          cpf: string | null
          created_at: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string | null
          valor_diaria: number | null
        }
        Insert: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_diaria?: number | null
        }
        Update: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_diaria?: number | null
        }
        Relationships: []
      }
      caminhoes: {
        Row: {
          ano: number | null
          ativo: boolean
          capacidade_m3: number | null
          created_at: string
          id: string
          marca: string | null
          modelo: string | null
          observacoes: string | null
          placa: string
          updated_at: string
        }
        Insert: {
          ano?: number | null
          ativo?: boolean
          capacidade_m3?: number | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          observacoes?: string | null
          placa: string
          updated_at?: string
        }
        Update: {
          ano?: number | null
          ativo?: boolean
          capacidade_m3?: number | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          observacoes?: string | null
          placa?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          tipo_pessoa: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string
        }
        Relationships: []
      }
      cubagens: {
        Row: {
          created_at: string
          data_cubagem: string
          dragagem_id: string
          id: string
          medida_inferior: number
          medida_superior: number
          observacoes: string | null
          paiol_id: string
          perimetro: number
          updated_at: string
          volume_normal: number
          volume_reduzido: number
        }
        Insert: {
          created_at?: string
          data_cubagem?: string
          dragagem_id: string
          id?: string
          medida_inferior: number
          medida_superior: number
          observacoes?: string | null
          paiol_id: string
          perimetro: number
          updated_at?: string
          volume_normal?: number
          volume_reduzido?: number
        }
        Update: {
          created_at?: string
          data_cubagem?: string
          dragagem_id?: string
          id?: string
          medida_inferior?: number
          medida_superior?: number
          observacoes?: string | null
          paiol_id?: string
          perimetro?: number
          updated_at?: string
          volume_normal?: number
          volume_reduzido?: number
        }
        Relationships: [
          {
            foreignKeyName: "cubagens_dragagem_id_fkey"
            columns: ["dragagem_id"]
            isOneToOne: true
            referencedRelation: "dragagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cubagens_paiol_id_fkey"
            columns: ["paiol_id"]
            isOneToOne: false
            referencedRelation: "paiols"
            referencedColumns: ["id"]
          },
        ]
      }
      dragadores: {
        Row: {
          ativo: boolean | null
          cpf: string | null
          created_at: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string | null
          valor_diaria: number | null
        }
        Insert: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_diaria?: number | null
        }
        Update: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          valor_diaria?: number | null
        }
        Relationships: []
      }
      dragagens: {
        Row: {
          ajudante_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          dragador_id: string
          id: string
          observacoes: string | null
          paiol_id: string
          updated_at: string
        }
        Insert: {
          ajudante_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          dragador_id: string
          id?: string
          observacoes?: string | null
          paiol_id: string
          updated_at?: string
        }
        Update: {
          ajudante_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          dragador_id?: string
          id?: string
          observacoes?: string | null
          paiol_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dragagens_ajudante_id_fkey"
            columns: ["ajudante_id"]
            isOneToOne: false
            referencedRelation: "ajudantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dragagens_dragador_id_fkey"
            columns: ["dragador_id"]
            isOneToOne: false
            referencedRelation: "dragadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dragagens_paiol_id_fkey"
            columns: ["paiol_id"]
            isOneToOne: false
            referencedRelation: "paiols"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas_mecanicas: {
        Row: {
          ativo: boolean
          contato: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          contato?: string | null
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          contato?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipamentos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          modelo: string
          placa: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          modelo: string
          placa?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          modelo?: string
          placa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fechamentos: {
        Row: {
          created_at: string
          data_fechamento: string
          id: string
          observacoes: string | null
          paiol_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fechamento?: string
          id?: string
          observacoes?: string | null
          paiol_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fechamento?: string
          id?: string
          observacoes?: string | null
          paiol_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fechamentos_paiol_id_fkey"
            columns: ["paiol_id"]
            isOneToOne: false
            referencedRelation: "paiols"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_gerais: {
        Row: {
          anexos: string[] | null
          created_at: string
          data: string
          equipamento_id: string
          id: string
          observacoes: string | null
          responsavel: string | null
          tipo_id: string
          updated_at: string
          valor: number
        }
        Insert: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          equipamento_id: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          tipo_id: string
          updated_at?: string
          valor: number
        }
        Update: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          equipamento_id?: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          tipo_id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "gastos_gerais_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_gerais_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_gastos"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_insumos: {
        Row: {
          created_at: string
          data_gasto: string
          dragagem_id: string
          fornecedor: string | null
          id: string
          observacoes: string | null
          quantidade: number
          tipo_insumo_id: string
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          data_gasto?: string
          dragagem_id: string
          fornecedor?: string | null
          id?: string
          observacoes?: string | null
          quantidade: number
          tipo_insumo_id: string
          updated_at?: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string
          data_gasto?: string
          dragagem_id?: string
          fornecedor?: string | null
          id?: string
          observacoes?: string | null
          quantidade?: number
          tipo_insumo_id?: string
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "gastos_insumos_dragagem_id_fkey"
            columns: ["dragagem_id"]
            isOneToOne: false
            referencedRelation: "dragagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_insumos_tipo_insumo_id_fkey"
            columns: ["tipo_insumo_id"]
            isOneToOne: false
            referencedRelation: "tipos_insumos"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_status_paiols: {
        Row: {
          data_mudanca: string | null
          id: string
          observacoes: string | null
          paiol_id: string
          status_anterior: string | null
          status_novo: string
          usuario_id: string | null
        }
        Insert: {
          data_mudanca?: string | null
          id?: string
          observacoes?: string | null
          paiol_id: string
          status_anterior?: string | null
          status_novo: string
          usuario_id?: string | null
        }
        Update: {
          data_mudanca?: string | null
          id?: string
          observacoes?: string | null
          paiol_id?: string
          status_anterior?: string | null
          status_novo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_status_paiols_paiol_id_fkey"
            columns: ["paiol_id"]
            isOneToOne: false
            referencedRelation: "paiols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_status_paiols_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      manutencoes: {
        Row: {
          anexos: string[] | null
          created_at: string
          data: string
          empresa_id: string
          equipamento_id: string
          id: string
          observacoes: string | null
          responsavel: string | null
          tipo_id: string
          updated_at: string
          valor: number
        }
        Insert: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          empresa_id: string
          equipamento_id: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          tipo_id: string
          updated_at?: string
          valor?: number
        }
        Update: {
          anexos?: string[] | null
          created_at?: string
          data?: string
          empresa_id?: string
          equipamento_id?: string
          id?: string
          observacoes?: string | null
          responsavel?: string | null
          tipo_id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "manutencoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_mecanicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manutencoes_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manutencoes_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_manutencao"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos_pessoal: {
        Row: {
          created_at: string
          data_pagamento: string
          dragagem_id: string
          id: string
          observacoes: string | null
          pessoa_id: string
          tipo_pagamento: string
          tipo_pessoa: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_pagamento?: string
          dragagem_id: string
          id?: string
          observacoes?: string | null
          pessoa_id: string
          tipo_pagamento?: string
          tipo_pessoa: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_pagamento?: string
          dragagem_id?: string
          id?: string
          observacoes?: string | null
          pessoa_id?: string
          tipo_pagamento?: string
          tipo_pessoa?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pessoal_dragagem_id_fkey"
            columns: ["dragagem_id"]
            isOneToOne: false
            referencedRelation: "dragagens"
            referencedColumns: ["id"]
          },
        ]
      }
      paiols: {
        Row: {
          ativo: boolean | null
          ciclo_atual: number | null
          created_at: string | null
          data_abertura: string | null
          data_fechamento: string | null
          id: string
          localizacao: string
          nome: string
          observacoes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          ciclo_atual?: number | null
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          id?: string
          localizacao: string
          nome: string
          observacoes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          ciclo_atual?: number | null
          created_at?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          id?: string
          localizacao?: string
          nome?: string
          observacoes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          id: string
          nome_completo: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          id: string
          nome_completo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          id?: string
          nome_completo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      retiradas: {
        Row: {
          caminhao_frete_id: string | null
          caminhao_id: string | null
          cliente_id: string
          created_at: string
          data_pagamento: string | null
          data_retirada: string
          id: string
          motorista_cpf: string | null
          motorista_nome: string | null
          observacoes: string | null
          paiol_id: string
          placa_informada: string | null
          status_pagamento: string
          tem_frete: boolean
          updated_at: string
          valor_frete: number | null
          valor_total: number | null
          valor_unitario: number | null
          volume_retirado: number
        }
        Insert: {
          caminhao_frete_id?: string | null
          caminhao_id?: string | null
          cliente_id: string
          created_at?: string
          data_pagamento?: string | null
          data_retirada?: string
          id?: string
          motorista_cpf?: string | null
          motorista_nome?: string | null
          observacoes?: string | null
          paiol_id: string
          placa_informada?: string | null
          status_pagamento?: string
          tem_frete?: boolean
          updated_at?: string
          valor_frete?: number | null
          valor_total?: number | null
          valor_unitario?: number | null
          volume_retirado: number
        }
        Update: {
          caminhao_frete_id?: string | null
          caminhao_id?: string | null
          cliente_id?: string
          created_at?: string
          data_pagamento?: string | null
          data_retirada?: string
          id?: string
          motorista_cpf?: string | null
          motorista_nome?: string | null
          observacoes?: string | null
          paiol_id?: string
          placa_informada?: string | null
          status_pagamento?: string
          tem_frete?: boolean
          updated_at?: string
          valor_frete?: number | null
          valor_total?: number | null
          valor_unitario?: number | null
          volume_retirado?: number
        }
        Relationships: [
          {
            foreignKeyName: "retiradas_caminhao_frete_id_fkey"
            columns: ["caminhao_frete_id"]
            isOneToOne: false
            referencedRelation: "caminhoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retiradas_caminhao_id_fkey"
            columns: ["caminhao_id"]
            isOneToOne: false
            referencedRelation: "caminhoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retiradas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retiradas_paiol_id_fkey"
            columns: ["paiol_id"]
            isOneToOne: false
            referencedRelation: "paiols"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_gastos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_insumos: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          id: string
          nome: string
          observacoes: string | null
          unidade_medida: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          id?: string
          nome: string
          observacoes?: string | null
          unidade_medida?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          id?: string
          nome?: string
          observacoes?: string | null
          unidade_medida?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_manutencao: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_status_transition: {
        Args: {
          p_paiol_id: string
          p_new_status: string
          p_dragador_id?: string
          p_ajudante_id?: string
          p_observacoes?: string
          p_usuario_id?: string
        }
        Returns: boolean
      }
      get_user_highest_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_users_with_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          nome: string
          role: Database["public"]["Enums"]["app_role"]
          assigned_at: string
          created_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      validate_status_transition: {
        Args: {
          p_paiol_id: string
          p_new_status: string
          p_dragador_id?: string
          p_ajudante_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "administrador" | "operador" | "visualizador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["administrador", "operador", "visualizador"],
    },
  },
} as const
