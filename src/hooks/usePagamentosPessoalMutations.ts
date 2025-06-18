
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PagamentoPessoal } from '@/types/database';

interface CreatePagamentoPessoalData {
  dragagem_id: string;
  pessoa_id: string;
  tipo_pessoa: 'DRAGADOR' | 'AJUDANTE';
  tipo_pagamento: 'ADIANTAMENTO' | 'PAGAMENTO_FINAL';
  valor: number;
  data_pagamento: string;
  observacoes?: string;
}

interface UpdatePagamentoPessoalData extends Partial<CreatePagamentoPessoalData> {
  id: string;
}

export const usePagamentoPessoalMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPagamentoPessoal = useMutation({
    mutationFn: async (data: CreatePagamentoPessoalData): Promise<PagamentoPessoal> => {
      console.log('Criando pagamento:', data);
      
      const { data: pagamento, error } = await supabase
        .from('pagamentos_pessoal')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
      }

      return pagamento as PagamentoPessoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos-pessoal'] });
      toast({
        title: 'Pagamento registrado',
        description: 'O pagamento foi registrado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar pagamento:', error);
      toast({
        title: 'Erro ao registrar pagamento',
        description: 'Não foi possível registrar o pagamento. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const updatePagamentoPessoal = useMutation({
    mutationFn: async ({ id, ...data }: UpdatePagamentoPessoalData): Promise<PagamentoPessoal> => {
      console.log('Atualizando pagamento:', id, data);
      
      const { data: pagamento, error } = await supabase
        .from('pagamentos_pessoal')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar pagamento:', error);
        throw error;
      }

      return pagamento as PagamentoPessoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos-pessoal'] });
      toast({
        title: 'Pagamento atualizado',
        description: 'O pagamento foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar pagamento:', error);
      toast({
        title: 'Erro ao atualizar pagamento',
        description: 'Não foi possível atualizar o pagamento. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const deletePagamentoPessoal = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Deletando pagamento:', id);
      
      const { error } = await supabase
        .from('pagamentos_pessoal')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar pagamento:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos-pessoal'] });
      toast({
        title: 'Pagamento removido',
        description: 'O pagamento foi removido com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar pagamento:', error);
      toast({
        title: 'Erro ao remover pagamento',
        description: 'Não foi possível remover o pagamento. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  return {
    createPagamentoPessoal,
    updatePagamentoPessoal,
    deletePagamentoPessoal,
  };
};
