
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateEmpresaMecanicaData, UpdateEmpresaMecanicaData } from '@/types/empresas-mecanicas';

export const useEmpresaMetanicaMutations = () => {
  const queryClient = useQueryClient();

  const createEmpresaMecanica = useMutation({
    mutationFn: async (data: CreateEmpresaMecanicaData) => {
      console.log('Criando empresa mecânica:', data);
      
      const { data: result, error } = await supabase
        .from('empresas_mecanicas')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar empresa mecânica:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Empresa mecânica cadastrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['empresas-mecanicas'] });
    },
    onError: (error) => {
      console.error('Erro ao cadastrar empresa mecânica:', error);
      toast.error('Erro ao cadastrar empresa mecânica');
    },
  });

  const updateEmpresaMecanica = useMutation({
    mutationFn: async ({ id, ...data }: UpdateEmpresaMecanicaData) => {
      console.log('Atualizando empresa mecânica:', { id, ...data });
      
      const { data: result, error } = await supabase
        .from('empresas_mecanicas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar empresa mecânica:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Empresa mecânica atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['empresas-mecanicas'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar empresa mecânica:', error);
      toast.error('Erro ao atualizar empresa mecânica');
    },
  });

  const deleteEmpresaMecanica = useMutation({
    mutationFn: async (id: string) => {
      console.log('Desativando empresa mecânica:', id);
      
      const { error } = await supabase
        .from('empresas_mecanicas')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        console.error('Erro ao desativar empresa mecânica:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Empresa mecânica desativada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['empresas-mecanicas'] });
    },
    onError: (error) => {
      console.error('Erro ao desativar empresa mecânica:', error);
      toast.error('Erro ao desativar empresa mecânica');
    },
  });

  return {
    createEmpresaMecanica,
    updateEmpresaMecanica,
    deleteEmpresaMecanica,
  };
};
