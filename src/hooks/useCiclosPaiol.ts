
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CicloPaiol {
  ciclo: number;
  dataInicio: string;
  dataFim: string | null;
  status: 'ativo' | 'finalizado';
}

export const useCiclosPaiol = (paiolId?: string) => {
  return useQuery({
    queryKey: ['ciclos-paiol', paiolId],
    queryFn: async (): Promise<CicloPaiol[]> => {
      if (!paiolId) return [];

      console.log('Buscando ciclos do paiol:', paiolId);
      
      // Buscar fechamentos para determinar os ciclos
      const { data: fechamentos } = await supabase
        .from('fechamentos')
        .select('data_fechamento')
        .eq('paiol_id', paiolId)
        .order('data_fechamento', { ascending: true });

      // Buscar informações do paiol
      const { data: paiol } = await supabase
        .from('paiols')
        .select('created_at, ciclo_atual')
        .eq('id', paiolId)
        .single();

      if (!paiol) return [];

      const ciclos: CicloPaiol[] = [];
      const totalCiclos = (fechamentos?.length || 0) + 1;

      for (let numeroCiclo = 1; numeroCiclo <= totalCiclos; numeroCiclo++) {
        const isUltimoCiclo = numeroCiclo === totalCiclos;
        
        let dataInicio: string;
        let dataFim: string | null = null;
        
        if (numeroCiclo === 1) {
          // Primeiro ciclo: da criação do paiol até o primeiro fechamento
          dataInicio = paiol.created_at;
          if (fechamentos && fechamentos.length > 0) {
            dataFim = fechamentos[0].data_fechamento;
          }
        } else {
          // Ciclos subsequentes: do fechamento anterior até o próximo fechamento
          const fechamentoAnterior = fechamentos?.[numeroCiclo - 2];
          const proximoFechamento = fechamentos?.[numeroCiclo - 1];
          
          dataInicio = fechamentoAnterior.data_fechamento;
          if (proximoFechamento) {
            dataFim = proximoFechamento.data_fechamento;
          }
        }

        ciclos.push({
          ciclo: numeroCiclo,
          dataInicio,
          dataFim,
          status: isUltimoCiclo ? 'ativo' : 'finalizado',
        });
      }

      console.log(`Encontrados ${ciclos.length} ciclos para o paiol`);
      return ciclos.reverse(); // Retornar do mais recente para o mais antigo
    },
    enabled: !!paiolId,
  });
};
