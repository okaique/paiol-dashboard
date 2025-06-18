
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Equipamento } from '@/types/database';

export const useEquipamentoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEquipamento = useMutation({
    mutationFn: async (equipamento: Omit<Equipamento, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando equipamento:', equipamento);
      
      const { data, error } = await supabase
        .from('equipamentos')
        .insert([equipamento])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar equipamento:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] });
      toast({
        title: "Sucesso",
        description: "Equipamento cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de criar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar equipamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateEquipamento = useMutation({
    mutationFn: async ({ id, ...equipamento }: Partial<Equipamento> & { id: string }) => {
      console.log('Atualizando equipamento:', id, equipamento);
      
      const { data, error } = await supabase
        .from('equipamentos')
        .update(equipamento)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar equipamento:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] });
      toast({
        title: "Sucesso",
        description: "Equipamento atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualizar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar equipamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteEquipamento = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo equipamento:', id);
      
      const { error } = await supabase
        .from('equipamentos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir equipamento:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipamentos'] });
      toast({
        title: "Sucesso",
        description: "Equipamento excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na mutação de excluir equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir equipamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createEquipamento,
    updateEquipamento,
    deleteEquipamento,
  };
};
