
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Equipamento } from '@/types/database';

export const useEquipamentos = () => {
  return useQuery({
    queryKey: ['equipamentos'],
    queryFn: async () => {
      console.log('Buscando equipamentos...');
      
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('ativo', true)
        .order('modelo', { ascending: true });

      if (error) {
        console.error('Erro ao buscar equipamentos:', error);
        throw error;
      }

      console.log('Equipamentos encontrados:', data?.length || 0);
      return data as Equipamento[];
    },
  });
};
