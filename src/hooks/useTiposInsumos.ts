
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TipoInsumo } from '@/types/database';

export const useTiposInsumos = () => {
  return useQuery({
    queryKey: ['tipos-insumos'],
    queryFn: async (): Promise<TipoInsumo[]> => {
      console.log('Buscando tipos de insumos');
      
      const { data, error } = await supabase
        .from('tipos_insumos')
        .select('*')
        .eq('ativo', true)
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tipos de insumos:', error);
        throw error;
      }

      console.log('Tipos de insumos encontrados:', data);
      return data || [];
    },
  });
};

export const useTipoInsumo = (id: string) => {
  return useQuery({
    queryKey: ['tipo-insumo', id],
    queryFn: async (): Promise<TipoInsumo | null> => {
      console.log('Buscando tipo de insumo:', id);
      
      const { data, error } = await supabase
        .from('tipos_insumos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar tipo de insumo:', error);
        throw error;
      }

      console.log('Tipo de insumo encontrado:', data);
      return data;
    },
    enabled: !!id,
  });
};
