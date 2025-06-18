
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Paiol } from '@/types/database';

interface EventoCiclo {
  tipo: 'transicao' | 'dragagem' | 'cubagem' | 'retirada' | 'fechamento';
  data: string;
  descricao: string;
  detalhes?: Record<string, any>;
}

interface CicloData {
  ciclo: number;
  dataInicio?: string;
  dataFim?: string;
  status: 'ativo' | 'finalizado';
  eventos: EventoCiclo[];
  resumo: {
    totalEventos: number;
    duracaoTotal?: string;
    statusFinal?: string;
  };
}

export const useHistoricoCiclos = (paiol: Paiol) => {
  return useQuery({
    queryKey: ['historico-ciclos', paiol.id],
    queryFn: async (): Promise<CicloData[]> => {
      console.log('Buscando histórico de ciclos para paiol:', paiol.id);
      
      // 1. Buscar todos os fechamentos para determinar os ciclos
      const { data: fechamentos } = await supabase
        .from('fechamentos')
        .select('*')
        .eq('paiol_id', paiol.id)
        .order('data_fechamento', { ascending: true });

      console.log('Fechamentos encontrados:', fechamentos);

      const ciclos: CicloData[] = [];
      
      // Criar um ciclo para cada fechamento + o ciclo atual
      const totalCiclos = (fechamentos?.length || 0) + 1;
      
      for (let numeroCiclo = 1; numeroCiclo <= totalCiclos; numeroCiclo++) {
        const isUltimoCiclo = numeroCiclo === totalCiclos;
        
        // Definir período do ciclo
        let dataInicioCiclo: Date;
        let dataFimCiclo: Date | null = null;
        
        if (numeroCiclo === 1) {
          // Primeiro ciclo: da criação do paiol até o primeiro fechamento
          dataInicioCiclo = new Date(paiol.created_at);
          if (fechamentos && fechamentos.length > 0) {
            dataFimCiclo = new Date(fechamentos[0].data_fechamento);
          }
        } else {
          // Ciclos subsequentes: do fechamento anterior até o próximo fechamento
          const fechamentoAnterior = fechamentos?.[numeroCiclo - 2];
          const proximoFechamento = fechamentos?.[numeroCiclo - 1];
          
          dataInicioCiclo = new Date(fechamentoAnterior.data_fechamento);
          if (proximoFechamento) {
            dataFimCiclo = new Date(proximoFechamento.data_fechamento);
          }
        }

        console.log(`Processando ciclo ${numeroCiclo}:`, {
          dataInicio: dataInicioCiclo,
          dataFim: dataFimCiclo,
          isUltimo: isUltimoCiclo
        });

        const eventos: EventoCiclo[] = [];

        // Buscar eventos do período específico do ciclo
        const dataInicioISO = dataInicioCiclo.toISOString();
        const dataFimISO = dataFimCiclo?.toISOString();

        // 2. Transições de status do ciclo
        let queryTransicoes = supabase
          .from('historico_status_paiols')
          .select('*')
          .eq('paiol_id', paiol.id)
          .gte('data_mudanca', dataInicioISO);

        if (dataFimISO) {
          queryTransicoes = queryTransicoes.lte('data_mudanca', dataFimISO);
        }

        const { data: transicoesCiclo } = await queryTransicoes.order('data_mudanca', { ascending: true });

        transicoesCiclo?.forEach(transicao => {
          eventos.push({
            tipo: 'transicao',
            data: transicao.data_mudanca,
            descricao: `Status alterado de ${transicao.status_anterior || 'N/A'} para ${transicao.status_novo}`,
            detalhes: {
              statusAnterior: transicao.status_anterior,
              statusNovo: transicao.status_novo,
              observacoes: transicao.observacoes,
            },
          });
        });

        // 3. Dragagens do ciclo
        let queryDragagens = supabase
          .from('dragagens')
          .select(`
            *,
            dragador:dragadores(nome),
            ajudante:ajudantes(nome)
          `)
          .eq('paiol_id', paiol.id)
          .gte('data_inicio', dataInicioISO);

        if (dataFimISO) {
          queryDragagens = queryDragagens.lte('data_inicio', dataFimISO);
        }

        const { data: dragagensCiclo } = await queryDragagens.order('data_inicio', { ascending: true });

        dragagensCiclo?.forEach(dragagem => {
          eventos.push({
            tipo: 'dragagem',
            data: dragagem.data_inicio,
            descricao: `Dragagem iniciada com ${dragagem.dragador?.nome}${dragagem.ajudante ? ` e ${dragagem.ajudante.nome}` : ''}`,
            detalhes: {
              dragador: dragagem.dragador?.nome,
              ajudante: dragagem.ajudante?.nome,
              dataFim: dragagem.data_fim,
              observacoes: dragagem.observacoes,
            },
          });
        });

        // 4. Cubagens do ciclo
        let queryCubagens = supabase
          .from('cubagens')
          .select('*')
          .eq('paiol_id', paiol.id)
          .gte('data_cubagem', dataInicioISO);

        if (dataFimISO) {
          queryCubagens = queryCubagens.lte('data_cubagem', dataFimISO);
        }

        const { data: cubagensCiclo } = await queryCubagens.order('data_cubagem', { ascending: true });

        cubagensCiclo?.forEach(cubagem => {
          eventos.push({
            tipo: 'cubagem',
            data: cubagem.data_cubagem,
            descricao: `Cubagem registrada: ${cubagem.volume_reduzido.toFixed(2)} m³`,
            detalhes: {
              volumeNormal: cubagem.volume_normal,
              volumeReduzido: cubagem.volume_reduzido,
              medidaInferior: cubagem.medida_inferior,
              medidaSuperior: cubagem.medida_superior,
              perimetro: cubagem.perimetro,
            },
          });
        });

        // 5. Retiradas do ciclo
        let queryRetiradas = supabase
          .from('retiradas')
          .select(`
            *,
            clientes(nome)
          `)
          .eq('paiol_id', paiol.id)
          .gte('data_retirada', dataInicioISO);

        if (dataFimISO) {
          queryRetiradas = queryRetiradas.lte('data_retirada', dataFimISO);
        }

        const { data: retiradasCiclo } = await queryRetiradas.order('data_retirada', { ascending: true });

        retiradasCiclo?.forEach(retirada => {
          eventos.push({
            tipo: 'retirada',
            data: retirada.data_retirada,
            descricao: `${retirada.volume_retirado}m³ retirados por ${retirada.clientes?.nome || 'Cliente não informado'}`,
            detalhes: {
              cliente: retirada.clientes?.nome,
              volume: retirada.volume_retirado,
              valorTotal: retirada.valor_total,
              statusPagamento: retirada.status_pagamento,
            },
          });
        });

        // 6. Fechamento do ciclo (se não for o último)
        if (!isUltimoCiclo && dataFimCiclo) {
          const fechamentoCiclo = fechamentos?.[numeroCiclo - 1];
          if (fechamentoCiclo) {
            eventos.push({
              tipo: 'fechamento',
              data: fechamentoCiclo.data_fechamento,
              descricao: 'Ciclo finalizado',
              detalhes: {
                observacoes: fechamentoCiclo.observacoes,
              },
            });
          }
        }

        // Ordenar eventos por data
        eventos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        // Calcular duração do ciclo
        let duracaoTotal: string | undefined;
        if (dataFimCiclo) {
          const diffMs = dataFimCiclo.getTime() - dataInicioCiclo.getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          duracaoTotal = `${diffDias} dia${diffDias > 1 ? 's' : ''}`;
        }

        // Determinar status final do ciclo
        const ultimaTransicao = transicoesCiclo?.[transicoesCiclo.length - 1];
        const statusFinal = isUltimoCiclo ? paiol.status : ultimaTransicao?.status_novo || 'VAZIO';

        ciclos.push({
          ciclo: numeroCiclo,
          dataInicio: dataInicioCiclo.toISOString(),
          dataFim: dataFimCiclo?.toISOString(),
          status: isUltimoCiclo ? 'ativo' : 'finalizado',
          eventos,
          resumo: {
            totalEventos: eventos.length,
            duracaoTotal,
            statusFinal,
          },
        });
      }

      console.log(`Retornando ${ciclos.length} ciclos processados`);
      return ciclos.reverse(); // Retornar do mais recente para o mais antigo
    },
  });
};
