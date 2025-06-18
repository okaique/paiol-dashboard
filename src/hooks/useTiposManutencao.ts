
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TipoManutencao } from '@/types/tipos-manutencao';

export const useTiposManutencao = () => {
  return useQuery({
    queryKey: ['tipos-manutencao'],
    queryFn: async () => {
      console.log('Buscando tipos de manutenção...');
      
      const { data, error } = await supabase
        .from('tipos_manutencao')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tipos de manutenção:', error);
        throw error;
      }

      console.log('Tipos de manutenção encontrados:', data?.length || 0);
      return data as TipoManutencao[];
    },
  });
};
