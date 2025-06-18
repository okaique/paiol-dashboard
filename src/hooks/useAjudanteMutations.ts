
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Ajudante } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

type AjudanteInput = {
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  valor_diaria?: number;
  observacoes?: string;
};

export const useAjudanteMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createAjudante = useMutation({
    mutationFn: async (data: AjudanteInput) => {
      console.log('Criando ajudante:', data);
      const { data: result, error } = await supabase
        .from('ajudantes')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar ajudante:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ajudantes'] });
      toast({
        title: "Sucesso",
        description: "Ajudante criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na criação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ajudante. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateAjudante = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AjudanteInput> }) => {
      console.log('Atualizando ajudante:', id, data);
      const { data: result, error } = await supabase
        .from('ajudantes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar ajudante:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ajudantes'] });
      toast({
        title: "Sucesso",
        description: "Ajudante atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ajudante. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteAjudante = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deletando ajudante:', id);
      const { error } = await supabase
        .from('ajudantes')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar ajudante:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ajudantes'] });
      toast({
        title: "Sucesso",
        description: "Ajudante removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na remoção:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover ajudante. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createAjudante,
    updateAjudante,
    deleteAjudante,
  };
};
