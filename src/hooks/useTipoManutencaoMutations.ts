
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateTipoManutencaoData, UpdateTipoManutencaoData } from '@/types/tipos-manutencao';

export const useTipoManutencaoMutations = () => {
  const queryClient = useQueryClient();

  const createTipoManutencao = useMutation({
    mutationFn: async (data: CreateTipoManutencaoData) => {
      console.log('Criando tipo de manutenção:', data);
      
      const { data: result, error } = await supabase
        .from('tipos_manutencao')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tipo de manutenção:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Tipo de manutenção cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tipos-manutencao'] });
    },
    onError: (error) => {
      console.error('Erro ao cadastrar tipo de manutenção:', error);
      toast.error('Erro ao cadastrar tipo de manutenção');
    },
  });

  const updateTipoManutencao = useMutation({
    mutationFn: async ({ id, ...data }: UpdateTipoManutencaoData) => {
      console.log('Atualizando tipo de manutenção:', { id, ...data });
      
      const { data: result, error } = await supabase
        .from('tipos_manutencao')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tipo de manutenção:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Tipo de manutenção atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tipos-manutencao'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar tipo de manutenção:', error);
      toast.error('Erro ao atualizar tipo de manutenção');
    },
  });

  const deleteTipoManutencao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Desativando tipo de manutenção:', id);
      
      const { error } = await supabase
        .from('tipos_manutencao')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao desativar tipo de manutenção:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Tipo de manutenção desativado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tipos-manutencao'] });
    },
    onError: (error) => {
      console.error('Erro ao desativar tipo de manutenção:', error);
      toast.error('Erro ao desativar tipo de manutenção');
    },
  });

  return {
    createTipoManutencao,
    updateTipoManutencao,
    deleteTipoManutencao,
  };
};
