
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TipoInsumo } from '@/types/database';

type CreateTipoInsumoData = {
  nome: string;
  categoria: string;
  unidade_medida: string;
  observacoes?: string;
  ativo?: boolean;
};

type UpdateTipoInsumoData = Partial<CreateTipoInsumoData>;

export const useTipoInsumoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTipoInsumo = useMutation({
    mutationFn: async (data: CreateTipoInsumoData) => {
      console.log('Criando tipo de insumo:', data);
      
      const { data: result, error } = await supabase
        .from('tipos_insumos')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tipo de insumo:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-insumos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de insumo criado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de criação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar tipo de insumo.',
        variant: 'destructive',
      });
    },
  });

  const updateTipoInsumo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTipoInsumoData }) => {
      console.log('Atualizando tipo de insumo:', id, data);
      
      const { data: result, error } = await supabase
        .from('tipos_insumos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tipo de insumo:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-insumos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de insumo atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tipo de insumo.',
        variant: 'destructive',
      });
    },
  });

  const deleteTipoInsumo = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo tipo de insumo:', id);
      
      const { error } = await supabase
        .from('tipos_insumos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir tipo de insumo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-insumos'] });
      toast({
        title: 'Sucesso',
        description: 'Tipo de insumo excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de exclusão:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tipo de insumo.',
        variant: 'destructive',
      });
    },
  });

  return {
    createTipoInsumo,
    updateTipoInsumo,
    deleteTipoInsumo,
  };
};
