
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CreateTipoGastoData, UpdateTipoGastoData } from '@/types/database';

export const useTipoGastoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTipoGasto = useMutation({
    mutationFn: async (data: CreateTipoGastoData) => {
      console.log('Criando tipo de gasto:', data);
      
      const { data: result, error } = await supabase
        .from('tipos_gastos')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tipo de gasto:', error);
        throw error;
      }

      console.log('Tipo de gasto criado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-gastos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de gasto criado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na criação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar tipo de gasto. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const updateTipoGasto = useMutation({
    mutationFn: async (data: UpdateTipoGastoData) => {
      console.log('Atualizando tipo de gasto:', data);
      
      const { id, ...updateData } = data;
      const { data: result, error } = await supabase
        .from('tipos_gastos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tipo de gasto:', error);
        throw error;
      }

      console.log('Tipo de gasto atualizado:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-gastos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de gasto atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tipo de gasto. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const deleteTipoGasto = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo tipo de gasto:', id);
      
      const { error } = await supabase
        .from('tipos_gastos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir tipo de gasto:', error);
        throw error;
      }

      console.log('Tipo de gasto excluído:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-gastos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de gasto excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na exclusão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tipo de gasto. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  return {
    createTipoGasto,
    updateTipoGasto,
    deleteTipoGasto,
  };
};
