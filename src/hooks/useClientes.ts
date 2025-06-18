
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Cliente } from '@/types/database';

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async (): Promise<Cliente[]> => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }

      return (data || []) as Cliente[];
    },
  });
};

export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: async (): Promise<Cliente | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar cliente:', error);
        throw error;
      }

      return data as Cliente | null;
    },
    enabled: !!id,
  });
};
