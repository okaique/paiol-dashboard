
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TipoGasto } from '@/types/database';

export const useTiposGastos = () => {
  return useQuery({
    queryKey: ['tipos-gastos'],
    queryFn: async (): Promise<TipoGasto[]> => {
      console.log('Buscando tipos de gastos...');
      
      const { data, error } = await supabase
        .from('tipos_gastos')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar tipos de gastos:', error);
        throw error;
      }

      console.log('Tipos de gastos encontrados:', data?.length || 0);
      return data || [];
    },
  });
};

export const useTipoGasto = (id?: string) => {
  return useQuery({
    queryKey: ['tipo-gasto', id],
    queryFn: async (): Promise<TipoGasto | null> => {
      if (!id) return null;

      console.log('Buscando tipo de gasto:', id);
      
      const { data, error } = await supabase
        .from('tipos_gastos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar tipo de gasto:', error);
        throw error;
      }

      console.log('Tipo de gasto encontrado:', data);
      return data;
    },
    enabled: !!id,
  });
};
