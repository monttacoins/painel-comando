export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      area_entrega: {
        Row: {
          area_entrega: boolean | null
          cep: string | null
          created_at: string
          distancia: number | null
          distancia_maxima: number | null
          id: number
          session: string | null
          tempo_medio_entrega: string | null
          valor: number | null
          valor_frete: number | null
        }
        Insert: {
          area_entrega?: boolean | null
          cep?: string | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          id?: number
          session?: string | null
          tempo_medio_entrega?: string | null
          valor?: number | null
          valor_frete?: number | null
        }
        Update: {
          area_entrega?: boolean | null
          cep?: string | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          id?: number
          session?: string | null
          tempo_medio_entrega?: string | null
          valor?: number | null
          valor_frete?: number | null
        }
        Relationships: []
      }
      bebidas: {
        Row: {
          created_at: string
          discriminacao: string | null
          disponivel: string | null
          id: number
          nome: string | null
          tipo: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          discriminacao?: string | null
          disponivel?: string | null
          id?: number
          nome?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          discriminacao?: string | null
          disponivel?: string | null
          id?: number
          nome?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      borda_recheada: {
        Row: {
          created_at: string
          id: number
          tamanho_pizza: string | null
          valor_borda_recheada: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          tamanho_pizza?: string | null
          valor_borda_recheada?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          tamanho_pizza?: string | null
          valor_borda_recheada?: number | null
        }
        Relationships: []
      }
      cardapio: {
        Row: {
          categoria_id: number | null
          created_at: string
          discriminacao: string | null
          disponivel: boolean
          id: number
          nome: string | null
          preco_unitario: number | null
          updated_at: string | null
        }
        Insert: {
          categoria_id?: number | null
          created_at?: string
          discriminacao?: string | null
          disponivel?: boolean
          id?: number
          nome?: string | null
          preco_unitario?: number | null
          updated_at?: string | null
        }
        Update: {
          categoria_id?: number | null
          created_at?: string
          discriminacao?: string | null
          disponivel?: boolean
          id?: number
          nome?: string | null
          preco_unitario?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          id: number
          nome: string
          ordem_exibicao: number | null
        }
        Insert: {
          id?: number
          nome: string
          ordem_exibicao?: number | null
        }
        Update: {
          id?: number
          nome?: string
          ordem_exibicao?: number | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          aniversario: string | null
          area_entrega: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          codigo: string | null
          complemento: string | null
          compras: number | null
          created_at: string
          distancia: number | null
          distancia_maxima: number | null
          estado: string | null
          id: number
          nome: string | null
          numero: string | null
          rua: string | null
          status: string | null
          total_gasto: number | null
          ultima_atualizacao: string | null
          ultima_compra: string | null
          ultimo_pedido: string | null
          valor_frete: number | null
          whatsapp: string | null
        }
        Insert: {
          aniversario?: string | null
          area_entrega?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          compras?: number | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          estado?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          rua?: string | null
          status?: string | null
          total_gasto?: number | null
          ultima_atualizacao?: string | null
          ultima_compra?: string | null
          ultimo_pedido?: string | null
          valor_frete?: number | null
          whatsapp?: string | null
        }
        Update: {
          aniversario?: string | null
          area_entrega?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          codigo?: string | null
          complemento?: string | null
          compras?: number | null
          created_at?: string
          distancia?: number | null
          distancia_maxima?: number | null
          estado?: string | null
          id?: number
          nome?: string | null
          numero?: string | null
          rua?: string | null
          status?: string | null
          total_gasto?: number | null
          ultima_atualizacao?: string | null
          ultima_compra?: string | null
          ultimo_pedido?: string | null
          valor_frete?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      configuracoes_goodzap: {
        Row: {
          created_at: string
          distancia_maxima: number | null
          goodzap_status: string | null
          id: number
          model: string | null
          session: string | null
          tempo_atraso_minutos: number | null
          tempo_entrega_minutos: number | null
          tempo_resposta_minutos: number
        }
        Insert: {
          created_at?: string
          distancia_maxima?: number | null
          goodzap_status?: string | null
          id?: number
          model?: string | null
          session?: string | null
          tempo_atraso_minutos?: number | null
          tempo_entrega_minutos?: number | null
          tempo_resposta_minutos?: number
        }
        Update: {
          created_at?: string
          distancia_maxima?: number | null
          goodzap_status?: string | null
          id?: number
          model?: string | null
          session?: string | null
          tempo_atraso_minutos?: number | null
          tempo_entrega_minutos?: number | null
          tempo_resposta_minutos?: number
        }
        Relationships: []
      }
      empresa_info: {
        Row: {
          bairro_empresa: string | null
          cep_empresa: string | null
          cidade_empresa: string | null
          created_at: string
          id: number
          nome_empresa: string | null
          numero_empresa: string | null
          rua_empresa: string | null
          telefone_empresa: string | null
          token: string | null
          whatsapp_empresa: string | null
        }
        Insert: {
          bairro_empresa?: string | null
          cep_empresa?: string | null
          cidade_empresa?: string | null
          created_at?: string
          id?: number
          nome_empresa?: string | null
          numero_empresa?: string | null
          rua_empresa?: string | null
          telefone_empresa?: string | null
          token?: string | null
          whatsapp_empresa?: string | null
        }
        Update: {
          bairro_empresa?: string | null
          cep_empresa?: string | null
          cidade_empresa?: string | null
          created_at?: string
          id?: number
          nome_empresa?: string | null
          numero_empresa?: string | null
          rua_empresa?: string | null
          telefone_empresa?: string | null
          token?: string | null
          whatsapp_empresa?: string | null
        }
        Relationships: []
      }
      faixas_frete: {
        Row: {
          created_at: string | null
          id: string
          km_final: number
          km_inicial: number
          valor: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          km_final: number
          km_inicial: number
          valor: number
        }
        Update: {
          created_at?: string | null
          id?: string
          km_final?: number
          km_inicial?: number
          valor?: number
        }
        Relationships: []
      }
      horario_empresa_goodzap: {
        Row: {
          abre_as: string
          ativo: boolean
          created_at: string
          dia_semana_id: number
          dia_semana_nome: string
          fecha_as: string
        }
        Insert: {
          abre_as?: string
          ativo?: boolean
          created_at?: string
          dia_semana_id: number
          dia_semana_nome: string
          fecha_as?: string
        }
        Update: {
          abre_as?: string
          ativo?: boolean
          created_at?: string
          dia_semana_id?: number
          dia_semana_nome?: string
          fecha_as?: string
        }
        Relationships: []
      }
      horarios_goodzap: {
        Row: {
          ativa: boolean | null
          created_at: string
          detalhes: string | null
          horario: string
          id: number
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          detalhes?: string | null
          horario: string
          id?: number
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          detalhes?: string | null
          horario?: string
          id?: number
        }
        Relationships: []
      }
      keep_alive: {
        Row: {
          check: string | null
          created_at: string
          id: number
        }
        Insert: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      numeros_especiais: {
        Row: {
          created_at: string
          id: number
          nome: string
          telefone: string
        }
        Insert: {
          created_at?: string
          id?: number
          nome: string
          telefone: string
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      outros_produtos: {
        Row: {
          created_at: string
          descricao: string | null
          disponivel: boolean | null
          id: number
          produto: string | null
          tipo: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          disponivel?: boolean | null
          id?: number
          produto?: string | null
          tipo?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          disponivel?: boolean | null
          id?: number
          produto?: string | null
          tipo?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      pedidos_goodzap: {
        Row: {
          cep: string | null
          codigo_pedido: string
          created_at: string
          criado_em: string | null
          empresa: string | null
          endereco: string
          id: number
          nome: string
          observacoes: string | null
          pagamento: string | null
          pedido: string
          sessao: string
          total: string
          ultimo_envio: string | null
          ultimo_pedido: string | null
          whatsapp: string
        }
        Insert: {
          cep?: string | null
          codigo_pedido: string
          created_at: string
          criado_em?: string | null
          empresa?: string | null
          endereco: string
          id?: number
          nome: string
          observacoes?: string | null
          pagamento?: string | null
          pedido: string
          sessao: string
          total: string
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          whatsapp: string
        }
        Update: {
          cep?: string | null
          codigo_pedido?: string
          created_at?: string
          criado_em?: string | null
          empresa?: string | null
          endereco?: string
          id?: number
          nome?: string
          observacoes?: string | null
          pagamento?: string | null
          pedido?: string
          sessao?: string
          total?: string
          ultimo_envio?: string | null
          ultimo_pedido?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      promocao_aniversario: {
        Row: {
          created_at: string
          enviado: string | null
          id: number
          mensagem_1: string | null
          mensagem_2: string | null
          mensagem_3: string | null
          quant_msg: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          enviado?: string | null
          id?: number
          mensagem_1?: string | null
          mensagem_2?: string | null
          mensagem_3?: string | null
          quant_msg?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          enviado?: string | null
          id?: number
          mensagem_1?: string | null
          mensagem_2?: string | null
          mensagem_3?: string | null
          quant_msg?: number | null
          status?: string | null
        }
        Relationships: []
      }
      promocoes_goodzap: {
        Row: {
          ativa: boolean | null
          created_at: string
          id: number
          promocao: string
          regras: string | null
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          promocao: string
          regras?: string | null
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          promocao?: string
          regras?: string | null
        }
        Relationships: []
      }
      recuperacao_clientes: {
        Row: {
          ativa_promocao: string | null
          created_at: string
          data_final: string | null
          data_inicio: string | null
          id: number
          mensagem: string | null
          promocao: string | null
          status: string | null
        }
        Insert: {
          ativa_promocao?: string | null
          created_at?: string
          data_final?: string | null
          data_inicio?: string | null
          id?: number
          mensagem?: string | null
          promocao?: string | null
          status?: string | null
        }
        Update: {
          ativa_promocao?: string | null
          created_at?: string
          data_final?: string | null
          data_inicio?: string | null
          id?: number
          mensagem?: string | null
          promocao?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          created_at: string
          data_reserva: string | null
          horario_reserva: string | null
          id: number
          nome: string | null
          observacoes: string | null
          qtde_pessoas: number | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          data_reserva?: string | null
          horario_reserva?: string | null
          id?: number
          nome?: string | null
          observacoes?: string | null
          qtde_pessoas?: number | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          data_reserva?: string | null
          horario_reserva?: string | null
          id?: number
          nome?: string | null
          observacoes?: string | null
          qtde_pessoas?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      saudacoes_goodzap: {
        Row: {
          ativa: boolean | null
          created_at: string
          id: number
          saudacao: string
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          saudacao: string
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          saudacao?: string
        }
        Relationships: []
      }
      telefones_admin_goodzap: {
        Row: {
          ativa: boolean | null
          created_at: string
          id: number
          numero_atendente: string | null
          numero_gerente: string | null
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          numero_atendente?: string | null
          numero_gerente?: string | null
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          id?: number
          numero_atendente?: string | null
          numero_gerente?: string | null
        }
        Relationships: []
      }
      tokens: {
        Row: {
          created_at: string | null
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      atualizar_metricas_clientes: { Args: never; Returns: undefined }
      get_full_config: { Args: never; Returns: Json }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super-admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin", "super-admin"],
    },
  },
} as const
