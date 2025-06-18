
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Paiol } from '@/types/database';

export const usePaiols = () => {
  return useQuery({
    queryKey: ['paiols'],
    queryFn: async (): Promise<Paiol[]> => {
      console.log('Buscando paióls...');
      
      const { data: paiols, error } = await supabase
        .from('paiols')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar paióls:', error);
        throw error;
      }

      console.log('Paióls encontrados:', paiols);
      return paiols || [];
    },
    staleTime: 5000, // Reduzir para 5 segundos
    refetchInterval: 15000, // Revalidar a cada 15 segundos
  });
};

export const usePaiol = (id: string) => {
  return useQuery({
    queryKey: ['paiol', id],
    queryFn: async (): Promise<Paiol | null> => {
      console.log('Buscando paiol:', id);
      
      const { data: paiol, error } = await supabase
        .from('paiols')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Erro ao buscar paiol:', error);
        throw error;
      }

      console.log('Paiol encontrado:', paiol);
      return paiol;
    },
    staleTime: 5000,
    refetchInterval: 15000,
  });
};
