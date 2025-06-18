
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Dragador } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

type DragadorInput = {
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  valor_diaria?: number;
  observacoes?: string;
};

export const useDragadorMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDragador = useMutation({
    mutationFn: async (data: DragadorInput) => {
      console.log('Criando dragador:', data);
      const { data: result, error } = await supabase
        .from('dragadores')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar dragador:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragadores'] });
      toast({
        title: "Sucesso",
        description: "Dragador criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na criação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar dragador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateDragador = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DragadorInput> }) => {
      console.log('Atualizando dragador:', id, data);
      const { data: result, error } = await supabase
        .from('dragadores')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar dragador:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragadores'] });
      toast({
        title: "Sucesso",
        description: "Dragador atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dragador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteDragador = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deletando dragador:', id);
      const { error } = await supabase
        .from('dragadores')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar dragador:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragadores'] });
      toast({
        title: "Sucesso",
        description: "Dragador removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na remoção:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover dragador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createDragador,
    updateDragador,
    deleteDragador,
  };
};
