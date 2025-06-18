
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Equipamento } from '@/types/database';

export const useEquipamento = (id: string) => {
  return useQuery({
    queryKey: ['equipamento', id],
    queryFn: async () => {
      console.log('Buscando equipamento:', id);
      
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar equipamento:', error);
        throw error;
      }

      console.log('Equipamento encontrado:', data);
      return data as Equipamento;
    },
    enabled: !!id,
  });
};
