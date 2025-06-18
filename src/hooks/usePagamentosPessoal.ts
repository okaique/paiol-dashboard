
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PagamentoPessoal } from '@/types/database';

export const usePagamentosPessoal = (dragagemId?: string) => {
  return useQuery({
    queryKey: ['pagamentos-pessoal', dragagemId],
    queryFn: async (): Promise<PagamentoPessoal[]> => {
      console.log('Buscando pagamentos para dragagem:', dragagemId);
      
      let query = supabase
        .from('pagamentos_pessoal')
        .select('*')
        .order('data_pagamento', { ascending: false });

      if (dragagemId) {
        query = query.eq('dragagem_id', dragagemId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar pagamentos:', error);
        throw error;
      }

      console.log('Pagamentos encontrados:', data);
      return (data || []) as PagamentoPessoal[];
    },
    enabled: !!dragagemId,
  });
};

export const useCreatePagamentoPessoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pagamento: Omit<PagamentoPessoal, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando pagamento:', pagamento);
      
      const { data, error } = await supabase
        .from('pagamentos_pessoal')
        .insert(pagamento)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos-pessoal'] });
      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao registrar pagamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar pagamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
