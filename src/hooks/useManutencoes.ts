
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Manutencao {
  id: string;
  equipamento_id: string;
  empresa_id: string;
  tipo_id: string;
  data: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
  created_at: string;
  updated_at: string;
}

export const useManutencoes = (equipamentoId?: string) => {
  return useQuery({
    queryKey: equipamentoId ? ['manutencoes', equipamentoId] : ['manutencoes'],
    queryFn: async (): Promise<Manutencao[]> => {
      console.log('Buscando manutenções' + (equipamentoId ? ` para equipamento: ${equipamentoId}` : ' (todas)'));
      
      let query = supabase
        .from('manutencoes')
        .select(`
          *,
          equipamento:equipamentos(modelo),
          empresa:empresas_mecanicas(nome),
          tipo:tipos_manutencao(nome)
        `)
        .order('data', { ascending: false });

      if (equipamentoId) {
        query = query.eq('equipamento_id', equipamentoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar manutenções:', error);
        throw error;
      }

      console.log('Manutenções encontradas:', data);
      return data || [];
    },
  });
};

export const useManutencao = (id: string) => {
  return useQuery({
    queryKey: ['manutencao', id],
    queryFn: async (): Promise<Manutencao | null> => {
      console.log('Buscando manutenção:', id);
      
      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar manutenção:', error);
        throw error;
      }

      console.log('Manutenção encontrada:', data);
      return data;
    },
    enabled: !!id,
  });
};
