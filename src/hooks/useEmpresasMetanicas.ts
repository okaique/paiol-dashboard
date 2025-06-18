
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaMecanica } from '@/types/empresas-mecanicas';

export const useEmpresasMetanicas = () => {
  return useQuery({
    queryKey: ['empresas-mecanicas'],
    queryFn: async () => {
      console.log('Buscando empresas mecânicas...');
      
      const { data, error } = await supabase
        .from('empresas_mecanicas')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar empresas mecânicas:', error);
        throw error;
      }

      console.log('Empresas mecânicas encontradas:', data?.length || 0);
      return data as EmpresaMecanica[];
    },
  });
};
