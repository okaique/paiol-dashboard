
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreateManutencaoData {
  equipamento_id: string;
  empresa_id: string;
  tipo_id: string;
  data: string;
  valor: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}

export interface UpdateManutencaoData {
  id: string;
  empresa_id?: string;
  tipo_id?: string;
  data?: string;
  valor?: number;
  responsavel?: string;
  observacoes?: string;
  anexos?: string[];
}

export const useManutencaoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createManutencao = useMutation({
    mutationFn: async (data: CreateManutencaoData) => {
      console.log('Criando manutenção:', data);
      
      const { data: result, error } = await supabase
        .from('manutencoes')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar manutenção:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['manutencoes', data.equipamento_id] });
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] });
      toast({
        title: 'Sucesso',
        description: 'Manutenção registrada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de criação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar manutenção.',
        variant: 'destructive',
      });
    },
  });

  const updateManutencao = useMutation({
    mutationFn: async ({ id, ...data }: UpdateManutencaoData) => {
      console.log('Atualizando manutenção:', id, data);
      
      const { data: result, error } = await supabase
        .from('manutencoes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar manutenção:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['manutencoes', data.equipamento_id] });
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] });
      queryClient.invalidateQueries({ queryKey: ['manutencao', data.id] });
      toast({
        title: 'Sucesso',
        description: 'Manutenção atualizada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar manutenção.',
        variant: 'destructive',
      });
    },
  });

  const deleteManutencao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo manutenção:', id);
      
      const { error } = await supabase
        .from('manutencoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir manutenção:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manutencoes'] });
      toast({
        title: 'Sucesso',
        description: 'Manutenção excluída com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de exclusão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir manutenção.',
        variant: 'destructive',
      });
    },
  });

  return {
    createManutencao,
    updateManutencao,
    deleteManutencao,
  };
};
