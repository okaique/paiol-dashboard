
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Dragagem } from '@/types/database';

type DragagemInput = {
  paiol_id: string;
  dragador_id: string;
  ajudante_id?: string;
  observacoes?: string;
  data_inicio?: string | Date;
  data_fim?: string | Date;
};

export const useCreateDragagem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dragagem: DragagemInput) => {
      console.log('Criando dragagem:', dragagem);
      
      // Usar horário atual se não especificado
      const dataInicio = dragagem.data_inicio 
        ? (typeof dragagem.data_inicio === 'string' 
          ? dragagem.data_inicio 
          : dragagem.data_inicio.toISOString()) 
        : new Date().toISOString();
      
      const dataFim = dragagem.data_fim 
        ? (typeof dragagem.data_fim === 'string' 
          ? dragagem.data_fim 
          : dragagem.data_fim.toISOString()) 
        : undefined;
      
      const { data, error } = await supabase
        .from('dragagens')
        .insert({
          paiol_id: dragagem.paiol_id,
          dragador_id: dragagem.dragador_id,
          ajudante_id: dragagem.ajudante_id,
          observacoes: dragagem.observacoes,
          data_inicio: dataInicio,
          data_fim: dataFim
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar dragagem:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dragagens'] });
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      queryClient.invalidateQueries({ queryKey: ['paiol', data.paiol_id] });
      toast({
        title: 'Sucesso',
        description: 'Dragagem iniciada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar dragagem:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao iniciar dragagem. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useFinalizarDragagem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, observacoes }: { id: string; observacoes?: string }) => {
      console.log('Finalizando dragagem:', id);
      
      // Usar horário atual para finalização
      const dataFim = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('dragagens')
        .update({ 
          data_fim: dataFim,
          observacoes 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao finalizar dragagem:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dragagens'] });
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      queryClient.invalidateQueries({ queryKey: ['paiol', data.paiol_id] });
      toast({
        title: 'Sucesso',
        description: 'Dragagem finalizada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao finalizar dragagem:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao finalizar dragagem. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
