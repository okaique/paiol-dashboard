
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { GastoGeral } from '@/types/database';

export const useGastosGerais = (equipamentoId?: string) => {
  return useQuery({
    queryKey: ['gastos-gerais', equipamentoId],
    queryFn: async (): Promise<GastoGeral[]> => {
      console.log('Buscando gastos gerais...');
      
      let query = supabase
        .from('gastos_gerais')
        .select(`
          *,
          equipamento:equipamentos(modelo),
          tipo:tipos_gastos(nome)
        `)
        .order('data', { ascending: false });

      if (equipamentoId) {
        query = query.eq('equipamento_id', equipamentoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar gastos gerais:', error);
        throw error;
      }

      console.log('Gastos gerais encontrados:', data?.length || 0);
      return data || [];
    },
  });
};

export const useGastoGeral = (id?: string) => {
  return useQuery({
    queryKey: ['gasto-geral', id],
    queryFn: async (): Promise<GastoGeral | null> => {
      if (!id) return null;

      console.log('Buscando gasto geral:', id);
      
      const { data, error } = await supabase
        .from('gastos_gerais')
        .select(`
          *,
          equipamento:equipamentos(modelo),
          tipo:tipos_gastos(nome)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar gasto geral:', error);
        throw error;
      }

      console.log('Gasto geral encontrado:', data);
      return data;
    },
    enabled: !!id,
  });
};
