
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Cubagem } from '@/types/database';

interface CreateCubagemData {
  paiol_id: string;
  dragagem_id: string;
  medida_inferior: number;
  medida_superior: number;
  perimetro: number;
  volume_reduzido: number;
  data_cubagem?: string;
  observacoes?: string;
}

interface UpdateCubagemData {
  id: string;
  medida_inferior?: number;
  medida_superior?: number;
  perimetro?: number;
  volume_reduzido?: number;
  data_cubagem?: string;
  observacoes?: string;
}

export const useCreateCubagem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCubagemData) => {
      console.log('Criando cubagem:', data);
      
      // Garantir que a data_cubagem seja definida corretamente
      const cubagemComData = {
        ...data,
        data_cubagem: data.data_cubagem || new Date().toISOString()
      };
      
      const { data: result, error } = await supabase
        .from('cubagens')
        .insert([cubagemComData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cubagem:', error);
        throw error;
      }

      return result as Cubagem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cubagens'] });
      queryClient.invalidateQueries({ queryKey: ['cubagem-dragagem', data.dragagem_id] });
      toast.success('Cubagem registrada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar cubagem:', error);
      toast.error('Erro ao registrar cubagem. Tente novamente.');
    },
  });
};

export const useUpdateCubagem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCubagemData) => {
      const { data: result, error } = await supabase
        .from('cubagens')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cubagem:', error);
        throw error;
      }

      return result as Cubagem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cubagens'] });
      queryClient.invalidateQueries({ queryKey: ['cubagem', data.id] });
      queryClient.invalidateQueries({ queryKey: ['cubagem-dragagem', data.dragagem_id] });
      toast.success('Cubagem atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar cubagem:', error);
      toast.error('Erro ao atualizar cubagem. Tente novamente.');
    },
  });
};

export const useDeleteCubagem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cubagens')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar cubagem:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cubagens'] });
      toast.success('Cubagem removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar cubagem:', error);
      toast.error('Erro ao remover cubagem. Tente novamente.');
    },
  });
};
