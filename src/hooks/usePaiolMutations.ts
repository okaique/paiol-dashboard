
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Paiol } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

type PaiolInput = {
  nome: string;
  localizacao: string;
  observacoes?: string;
};

export const usePaiolMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPaiol = useMutation({
    mutationFn: async (data: PaiolInput) => {
      console.log('Criando paiol:', data);
      const { data: result, error } = await supabase
        .from('paiols')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar paiol:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      toast({
        title: "Sucesso",
        description: "Paiol criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na criação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar paiol. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updatePaiol = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PaiolInput> }) => {
      console.log('Atualizando paiol:', id, data);
      const { data: result, error } = await supabase
        .from('paiols')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar paiol:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      toast({
        title: "Sucesso",
        description: "Paiol atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar paiol. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deletePaiol = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deletando paiol:', id);
      const { error } = await supabase
        .from('paiols')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar paiol:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      toast({
        title: "Sucesso",
        description: "Paiol removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na remoção:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover paiol. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createPaiol,
    updatePaiol,
    deletePaiol,
  };
};
