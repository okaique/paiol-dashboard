
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Ajudante } from '@/types/database';

export const useAjudantes = () => {
  return useQuery({
    queryKey: ['ajudantes'],
    queryFn: async (): Promise<Ajudante[]> => {
      console.log('Buscando ajudantes...');
      const { data, error } = await supabase
        .from('ajudantes')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar ajudantes:', error);
        throw error;
      }

      console.log('Ajudantes encontrados:', data);
      return data || [];
    },
  });
};
