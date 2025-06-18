
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Caminhao } from '@/types/database';

export const useCaminhoes = () => {
  return useQuery({
    queryKey: ['caminhoes'],
    queryFn: async (): Promise<Caminhao[]> => {
      const { data, error } = await supabase
        .from('caminhoes')
        .select('*')
        .eq('ativo', true)
        .order('placa');

      if (error) {
        console.error('Erro ao buscar caminhões:', error);
        throw error;
      }

      return (data || []) as Caminhao[];
    },
  });
};

export const useCaminhao = (id: string) => {
  return useQuery({
    queryKey: ['caminhao', id],
    queryFn: async (): Promise<Caminhao | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('caminhoes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar caminhão:', error);
        throw error;
      }

      return data as Caminhao | null;
    },
    enabled: !!id,
  });
};
