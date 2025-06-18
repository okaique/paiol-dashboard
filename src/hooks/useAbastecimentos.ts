
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Abastecimento } from '@/types/abastecimentos';

export const useAbastecimentos = (equipamentoId?: string) => {
  return useQuery({
    queryKey: ['abastecimentos', equipamentoId],
    queryFn: async (): Promise<Abastecimento[]> => {
      let query = supabase
        .from('abastecimentos')
        .select(`
          *,
          equipamentos!inner(modelo)
        `)
        .order('data', { ascending: false });

      if (equipamentoId) {
        query = query.eq('equipamento_id', equipamentoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar abastecimentos:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAbastecimento = (id: string) => {
  return useQuery({
    queryKey: ['abastecimento', id],
    queryFn: async (): Promise<Abastecimento | null> => {
      const { data, error } = await supabase
        .from('abastecimentos')
        .select(`
          *,
          equipamentos!inner(modelo)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar abastecimento:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};
