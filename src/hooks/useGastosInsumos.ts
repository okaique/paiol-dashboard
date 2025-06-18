
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GastoInsumo } from '@/types/database';

export const useGastosInsumos = (dragagemId?: string) => {
  return useQuery({
    queryKey: ['gastos-insumos', dragagemId],
    queryFn: async (): Promise<GastoInsumo[]> => {
      console.log('Buscando gastos com insumos para dragagem:', dragagemId);
      
      let query = supabase
        .from('gastos_insumos')
        .select('*')
        .order('data_gasto', { ascending: false });

      if (dragagemId) {
        query = query.eq('dragagem_id', dragagemId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar gastos com insumos:', error);
        throw error;
      }

      console.log('Gastos com insumos encontrados:', data);
      return data || [];
    },
    enabled: !!dragagemId,
  });
};

export const useCreateGastoInsumo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (gasto: Omit<GastoInsumo, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando gasto com insumo:', gasto);
      
      // Garantir que a data seja definida como atual se não especificada
      const gastoComData = {
        ...gasto,
        data_gasto: gasto.data_gasto || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('gastos_insumos')
        .insert(gastoComData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar gasto com insumo:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gastos-insumos'] });
      toast({
        title: "Sucesso",
        description: "Gasto com insumo registrado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar gasto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar gasto com insumo. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
