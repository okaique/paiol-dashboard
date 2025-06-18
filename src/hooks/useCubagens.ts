
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Cubagem } from '@/types/database';

export const useCubagens = (paiolId?: string, dragagemId?: string) => {
  return useQuery({
    queryKey: ['cubagens', paiolId, dragagemId],
    queryFn: async () => {
      let query = supabase
        .from('cubagens')
        .select('*')
        .order('created_at', { ascending: false });

      if (paiolId) {
        query = query.eq('paiol_id', paiolId);
      }

      if (dragagemId) {
        query = query.eq('dragagem_id', dragagemId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar cubagens:', error);
        throw error;
      }

      return data as Cubagem[];
    },
    enabled: !!(paiolId || dragagemId),
  });
};

export const useCubagem = (id: string) => {
  return useQuery({
    queryKey: ['cubagem', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cubagens')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar cubagem:', error);
        throw error;
      }

      return data as Cubagem;
    },
    enabled: !!id,
  });
};

export const useCubagemPorDragagem = (dragagemId: string) => {
  return useQuery({
    queryKey: ['cubagem-dragagem', dragagemId],
    queryFn: async () => {
      console.log('Buscando cubagem para dragagem:', dragagemId);
      
      if (!dragagemId) {
        console.log('Dragagem ID não fornecido, retornando null');
        return null;
      }

      const { data, error } = await supabase
        .from('cubagens')
        .select('*')
        .eq('dragagem_id', dragagemId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar cubagem por dragagem:', error);
        throw error;
      }

      console.log('Cubagem encontrada:', data);
      return data as Cubagem | null;
    },
    enabled: !!dragagemId,
  });
};
