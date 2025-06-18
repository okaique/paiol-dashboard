
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateAbastecimentoData, UpdateAbastecimentoData } from '@/types/abastecimentos';
import { toast } from 'sonner';

export const useAbastecimentoMutations = () => {
  const queryClient = useQueryClient();

  const createAbastecimento = useMutation({
    mutationFn: async (data: CreateAbastecimentoData) => {
      const { data: result, error } = await supabase
        .from('abastecimentos')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar abastecimento:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['abastecimentos'] });
      queryClient.invalidateQueries({ queryKey: ['abastecimentos', data.equipamento_id] });
      toast.success('Abastecimento registrado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao registrar abastecimento:', error);
      toast.error('Erro ao registrar abastecimento. Tente novamente.');
    },
  });

  const updateAbastecimento = useMutation({
    mutationFn: async ({ id, ...data }: UpdateAbastecimentoData) => {
      const { data: result, error } = await supabase
        .from('abastecimentos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar abastecimento:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['abastecimentos'] });
      queryClient.invalidateQueries({ queryKey: ['abastecimentos', data.equipamento_id] });
      queryClient.invalidateQueries({ queryKey: ['abastecimento', data.id] });
      toast.success('Abastecimento atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar abastecimento:', error);
      toast.error('Erro ao atualizar abastecimento. Tente novamente.');
    },
  });

  const deleteAbastecimento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('abastecimentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir abastecimento:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abastecimentos'] });
      toast.success('Abastecimento excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir abastecimento:', error);
      toast.error('Erro ao excluir abastecimento. Tente novamente.');
    },
  });

  return {
    createAbastecimento,
    updateAbastecimento,
    deleteAbastecimento,
  };
};
