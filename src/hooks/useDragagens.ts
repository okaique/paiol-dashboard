
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Dragagem } from '@/types/database';

interface DragagemDetalhada extends Dragagem {
  dragador?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  ajudante?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  paiol?: {
    id: string;
    nome: string;
    status: string;
  };
}

export const useDragagens = (paiolId?: string) => {
  return useQuery({
    queryKey: ['dragagens', paiolId],
    queryFn: async (): Promise<DragagemDetalhada[]> => {
      console.log('Buscando dragagens para paiol:', paiolId);
      
      let query = supabase
        .from('dragagens')
        .select(`
          *,
          dragador:dragadores(id, nome, valor_diaria),
          ajudante:ajudantes(id, nome, valor_diaria),
          paiol:paiols(id, nome, status)
        `)
        .order('created_at', { ascending: false });

      if (paiolId) {
        query = query.eq('paiol_id', paiolId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar dragagens:', error);
        throw error;
      }

      console.log('Dragagens encontradas:', data);
      return data || [];
    },
    enabled: !!paiolId,
  });
};

export const useDragagemAtiva = (paiolId?: string) => {
  return useQuery({
    queryKey: ['dragagem-ativa', paiolId],
    queryFn: async (): Promise<DragagemDetalhada | null> => {
      if (!paiolId) return null;

      console.log('Buscando dragagem ativa para paiol:', paiolId);
      
      const { data, error } = await supabase
        .from('dragagens')
        .select(`
          *,
          dragador:dragadores(id, nome, valor_diaria),
          ajudante:ajudantes(id, nome, valor_diaria),
          paiol:paiols(id, nome, status)
        `)
        .eq('paiol_id', paiolId)
        .is('data_fim', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dragagem ativa:', error);
        throw error;
      }

      console.log('Dragagem ativa encontrada:', data);
      return data;
    },
    enabled: !!paiolId,
  });
};

// Nova função para buscar a dragagem mais recente (independente se está ativa ou finalizada)
export const useDragagemMaisRecente = (paiolId?: string) => {
  return useQuery({
    queryKey: ['dragagem-mais-recente', paiolId],
    queryFn: async (): Promise<DragagemDetalhada | null> => {
      if (!paiolId) return null;

      const { data, error } = await supabase
        .from('dragagens')
        .select(`
          *,
          dragador:dragadores(id, nome, valor_diaria),
          ajudante:ajudantes(id, nome, valor_diaria),
          paiol:paiols(id, nome, status)
        `)
        .eq('paiol_id', paiolId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dragagem mais recente:', error);
        throw error;
      }

      return data;
    },
    enabled: !!paiolId,
  });
};
