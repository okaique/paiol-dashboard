
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Retirada } from '@/types/database';

type RetiradaInput = Omit<Retirada, 'id' | 'created_at' | 'updated_at'>;
type RetiradaUpdate = Partial<RetiradaInput> & { id: string };

export const useCreateRetirada = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retirada: RetiradaInput) => {
      console.log('Criando retirada:', retirada);
      
      // Garantir que a data_retirada seja definida corretamente
      const retiradaComData = {
        ...retirada,
        data_retirada: retirada.data_retirada || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('retiradas')
        .insert(retiradaComData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar retirada:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retiradas'] });
      toast({
        title: 'Sucesso',
        description: 'Retirada registrada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar retirada:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar retirada. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateRetirada = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: RetiradaUpdate) => {
      const { data, error } = await supabase
        .from('retiradas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar retirada:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retiradas'] });
      queryClient.invalidateQueries({ queryKey: ['retirada'] });
      toast({
        title: 'Sucesso',
        description: 'Retirada atualizada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar retirada:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar retirada. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteRetirada = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('retiradas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir retirada:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retiradas'] });
      toast({
        title: 'Sucesso',
        description: 'Retirada excluída com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir retirada:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir retirada. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
