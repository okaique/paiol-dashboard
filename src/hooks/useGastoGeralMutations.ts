
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CreateGastoGeralData, UpdateGastoGeralData } from '@/types/database';

export const useGastoGeralMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createGastoGeral = useMutation({
    mutationFn: async (data: CreateGastoGeralData) => {
      console.log('Criando gasto geral:', data);
      
      const { data: result, error } = await supabase
        .from('gastos_gerais')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar gasto geral:', error);
        throw error;
      }

      console.log('Gasto geral criado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos-gerais'] });
      toast({
        title: 'Sucesso',
        description: 'Gasto geral registrado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na criação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar gasto geral. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const updateGastoGeral = useMutation({
    mutationFn: async (data: UpdateGastoGeralData) => {
      console.log('Atualizando gasto geral:', data);
      
      const { id, ...updateData } = data;
      const { data: result, error } = await supabase
        .from('gastos_gerais')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar gasto geral:', error);
        throw error;
      }

      console.log('Gasto geral atualizado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos-gerais'] });
      toast({
        title: 'Sucesso',
        description: 'Gasto geral atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar gasto geral. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const deleteGastoGeral = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo gasto geral:', id);
      
      const { error } = await supabase
        .from('gastos_gerais')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir gasto geral:', error);
        throw error;
      }

      console.log('Gasto geral excluído:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos-gerais'] });
      toast({
        title: 'Sucesso',
        description: 'Gasto geral excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na exclusão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir gasto geral. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  return {
    createGastoGeral,
    updateGastoGeral,
    deleteGastoGeral,
  };
};
