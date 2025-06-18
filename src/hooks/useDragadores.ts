
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Dragador } from '@/types/database';

export const useDragadores = () => {
  return useQuery({
    queryKey: ['dragadores'],
    queryFn: async (): Promise<Dragador[]> => {
      console.log('Buscando dragadores...');
      const { data, error } = await supabase
        .from('dragadores')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar dragadores:', error);
        throw error;
      }

      console.log('Dragadores encontrados:', data);
      return data || [];
    },
  });
};
