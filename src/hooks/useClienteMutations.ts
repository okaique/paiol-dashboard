
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Cliente } from '@/types/database';

type ClienteInput = Omit<Cliente, 'id' | 'created_at' | 'updated_at'>;
type ClienteUpdate = Partial<ClienteInput> & { id: string };

export const useCreateCliente = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cliente: ClienteInput) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert(cliente)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente cadastrado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar cliente. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCliente = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ClienteUpdate) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar cliente. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCliente = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao desativar cliente:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente removido com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover cliente. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
