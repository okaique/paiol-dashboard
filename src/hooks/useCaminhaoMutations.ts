
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CaminhaoInput {
  placa: string;
  modelo?: string;
  marca?: string;
  ano?: number;
  capacidade_m3?: number;
  observacoes?: string;
  ativo: boolean;
}

export const useCreateCaminhao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (caminhaoData: CaminhaoInput) => {
      const { data, error } = await supabase
        .from('caminhoes')
        .insert([caminhaoData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar caminhão:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caminhoes'] });
      toast({
        title: 'Sucesso',
        description: 'Caminhão cadastrado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar caminhão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar caminhão. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCaminhao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...caminhaoData }: CaminhaoInput & { id: string }) => {
      const { data, error } = await supabase
        .from('caminhoes')
        .update(caminhaoData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar caminhão:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caminhoes'] });
      toast({
        title: 'Sucesso',
        description: 'Caminhão atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar caminhão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar caminhão. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCaminhao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - apenas marcar como inativo
      const { data, error } = await supabase
        .from('caminhoes')
        .update({ ativo: false })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao excluir caminhão:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caminhoes'] });
      toast({
        title: 'Sucesso',
        description: 'Caminhão excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir caminhão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir caminhão. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
