
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CustoPorPaiol {
  paiol_id: string;
  paiol_nome: string;
  total_gastos_insumos: number;
  total_pagamentos_pessoal: number;
  total_geral: number;
  numero_dragagens: number;
}

interface RetiradaDetalhada {
  id: string;
  data_retirada: string;
  cliente_nome: string;
  volume_retirado: number;
  valor_unitario: number;
  valor_total: number;
  status_pagamento: string;
  motorista_nome?: string;
  placa_informada?: string;
}

interface VolumePorPeriodo {
  paiol_id: string;
  paiol_nome: string;
  periodo: string;
  volume_total_cubado: number;
  volume_total_retirado: number;
  volume_disponivel: number;
  numero_retiradas: number;
  retiradas_detalhadas: RetiradaDetalhada[];
}

interface FiltrosCustosPaiol {
  paiolId?: string;
  ciclo?: number;
  dataInicio?: string;
  dataFim?: string;
}

interface FiltrosVolumesPeriodo {
  paiolId?: string;
  ciclo?: number;
  dataInicio?: string;
  dataFim?: string;
}

export const useRelatorioCustosPorPaiol = (filtros: FiltrosCustosPaiol = {}) => {
  return useQuery({
    queryKey: ['relatorio-custos-paiol', filtros],
    queryFn: async (): Promise<CustoPorPaiol[]> => {
      console.log('Buscando relatório de custos por paiol com filtros:', filtros);
      
      // Determinar período do ciclo se ciclo foi especificado
      let dataInicioCiclo: string | undefined;
      let dataFimCiclo: string | undefined;
      
      if (filtros.paiolId && filtros.ciclo) {
        // Buscar fechamentos para determinar as datas do ciclo
        const { data: fechamentos } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', filtros.paiolId)
          .order('data_fechamento', { ascending: true });

        // Buscar data de criação do paiol
        const { data: paiol } = await supabase
          .from('paiols')
          .select('created_at')
          .eq('id', filtros.paiolId)
          .single();

        if (paiol) {
          const totalCiclos = (fechamentos?.length || 0) + 1;
          
          if (filtros.ciclo <= totalCiclos) {
            if (filtros.ciclo === 1) {
              // Primeiro ciclo
              dataInicioCiclo = paiol.created_at;
              if (fechamentos && fechamentos.length > 0) {
                dataFimCiclo = fechamentos[0].data_fechamento;
              }
            } else {
              // Ciclos subsequentes
              const fechamentoAnterior = fechamentos?.[filtros.ciclo - 2];
              const proximoFechamento = fechamentos?.[filtros.ciclo - 1];
              
              if (fechamentoAnterior) {
                dataInicioCiclo = fechamentoAnterior.data_fechamento;
                if (proximoFechamento) {
                  dataFimCiclo = proximoFechamento.data_fechamento;
                }
              }
            }
          }
        }
      }

      // Usar datas do ciclo ou datas especificadas manualmente
      const dataInicioFiltro = dataInicioCiclo || filtros.dataInicio;
      const dataFimFiltro = dataFimCiclo || filtros.dataFim;

      // Query para buscar gastos com insumos agrupados por paiol
      let gastosQuery = supabase
        .from('gastos_insumos')
        .select(`
          valor_total,
          data_gasto,
          dragagens!inner(
            paiol_id,
            paiols!inner(nome)
          )
        `);

      if (filtros.paiolId) {
        gastosQuery = gastosQuery.eq('dragagens.paiol_id', filtros.paiolId);
      }

      if (dataInicioFiltro) {
        gastosQuery = gastosQuery.gte('data_gasto', dataInicioFiltro);
      }

      if (dataFimFiltro) {
        const dataFimCompleta = new Date(dataFimFiltro);
        dataFimCompleta.setHours(23, 59, 59, 999);
        gastosQuery = gastosQuery.lte('data_gasto', dataFimCompleta.toISOString());
      }

      const { data: gastosData, error: gastosError } = await gastosQuery;
      
      if (gastosError) {
        console.error('Erro ao buscar gastos:', gastosError);
        throw gastosError;
      }

      // Query para buscar pagamentos de pessoal agrupados por paiol
      let pagamentosQuery = supabase
        .from('pagamentos_pessoal')
        .select(`
          valor,
          data_pagamento,
          dragagens!inner(
            paiol_id,
            paiols!inner(nome)
          )
        `);

      if (filtros.paiolId) {
        pagamentosQuery = pagamentosQuery.eq('dragagens.paiol_id', filtros.paiolId);
      }

      if (dataInicioFiltro) {
        pagamentosQuery = pagamentosQuery.gte('data_pagamento', dataInicioFiltro);
      }

      if (dataFimFiltro) {
        const dataFimCompleta = new Date(dataFimFiltro);
        dataFimCompleta.setHours(23, 59, 59, 999);
        pagamentosQuery = pagamentosQuery.lte('data_pagamento', dataFimCompleta.toISOString());
      }

      const { data: pagamentosData, error: pagamentosError } = await pagamentosQuery;
      
      if (pagamentosError) {
        console.error('Erro ao buscar pagamentos:', pagamentosError);
        throw pagamentosError;
      }

      // Processar dados e agrupar por paiol
      const custosPorPaiol = new Map<string, CustoPorPaiol>();

      // Processar gastos com insumos
      gastosData?.forEach((gasto: any) => {
        const paiolId = gasto.dragagens.paiol_id;
        const paiolNome = gasto.dragagens.paiols.nome;
        
        if (!custosPorPaiol.has(paiolId)) {
          custosPorPaiol.set(paiolId, {
            paiol_id: paiolId,
            paiol_nome: paiolNome,
            total_gastos_insumos: 0,
            total_pagamentos_pessoal: 0,
            total_geral: 0,
            numero_dragagens: 0,
          });
        }

        const custo = custosPorPaiol.get(paiolId)!;
        custo.total_gastos_insumos += Number(gasto.valor_total || 0);
      });

      // Processar pagamentos de pessoal
      pagamentosData?.forEach((pagamento: any) => {
        const paiolId = pagamento.dragagens.paiol_id;
        const paiolNome = pagamento.dragagens.paiols.nome;
        
        if (!custosPorPaiol.has(paiolId)) {
          custosPorPaiol.set(paiolId, {
            paiol_id: paiolId,
            paiol_nome: paiolNome,
            total_gastos_insumos: 0,
            total_pagamentos_pessoal: 0,
            total_geral: 0,
            numero_dragagens: 0,
          });
        }

        const custo = custosPorPaiol.get(paiolId)!;
        custo.total_pagamentos_pessoal += Number(pagamento.valor || 0);
      });

      // Calcular totais gerais
      custosPorPaiol.forEach((custo) => {
        custo.total_geral = custo.total_gastos_insumos + custo.total_pagamentos_pessoal;
      });

      return Array.from(custosPorPaiol.values());
    },
  });
};

export const useRelatorioVolumesPorPeriodo = (filtros: FiltrosVolumesPeriodo = {}) => {
  return useQuery({
    queryKey: ['relatorio-volumes-periodo', filtros],
    queryFn: async (): Promise<VolumePorPeriodo[]> => {
      console.log('Buscando relatório de volumes por período com filtros:', filtros);
      
      // Determinar período do ciclo se ciclo foi especificado
      let dataInicioCiclo: string | undefined;
      let dataFimCiclo: string | undefined;
      
      if (filtros.paiolId && filtros.ciclo) {
        // Buscar fechamentos para determinar as datas do ciclo
        const { data: fechamentos } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', filtros.paiolId)
          .order('data_fechamento', { ascending: true });

        // Buscar data de criação do paiol
        const { data: paiol } = await supabase
          .from('paiols')
          .select('created_at')
          .eq('id', filtros.paiolId)
          .single();

        if (paiol) {
          const totalCiclos = (fechamentos?.length || 0) + 1;
          
          if (filtros.ciclo <= totalCiclos) {
            if (filtros.ciclo === 1) {
              // Primeiro ciclo
              dataInicioCiclo = paiol.created_at;
              if (fechamentos && fechamentos.length > 0) {
                dataFimCiclo = fechamentos[0].data_fechamento;
              }
            } else {
              // Ciclos subsequentes
              const fechamentoAnterior = fechamentos?.[filtros.ciclo - 2];
              const proximoFechamento = fechamentos?.[filtros.ciclo - 1];
              
              if (fechamentoAnterior) {
                dataInicioCiclo = fechamentoAnterior.data_fechamento;
                if (proximoFechamento) {
                  dataFimCiclo = proximoFechamento.data_fechamento;
                }
              }
            }
          }
        }
      }

      // Usar datas do ciclo ou datas especificadas manualmente
      const dataInicioFiltro = dataInicioCiclo || filtros.dataInicio;
      const dataFimFiltro = dataFimCiclo || filtros.dataFim;

      // Query para buscar cubagens
      let cubagemQuery = supabase
        .from('cubagens')
        .select(`
          volume_normal,
          volume_reduzido,
          data_cubagem,
          paiol_id,
          paiols!inner(nome)
        `);

      if (filtros.paiolId) {
        cubagemQuery = cubagemQuery.eq('paiol_id', filtros.paiolId);
      }

      if (dataInicioFiltro) {
        cubagemQuery = cubagemQuery.gte('data_cubagem', dataInicioFiltro);
      }

      if (dataFimFiltro) {
        const dataFimCompleta = new Date(dataFimFiltro);
        dataFimCompleta.setHours(23, 59, 59, 999);
        cubagemQuery = cubagemQuery.lte('data_cubagem', dataFimCompleta.toISOString());
      }

      const { data: cubagemData, error: cubagemError } = await cubagemQuery;
      
      if (cubagemError) {
        console.error('Erro ao buscar cubagens:', cubagemError);
        throw cubagemError;
      }

      // Query para buscar retiradas com detalhes
      let retiradasQuery = supabase
        .from('retiradas')
        .select(`
          id,
          volume_retirado,
          valor_unitario,
          valor_total,
          data_retirada,
          status_pagamento,
          motorista_nome,
          placa_informada,
          paiol_id,
          paiols!inner(nome),
          clientes!inner(nome)
        `);

      if (filtros.paiolId) {
        retiradasQuery = retiradasQuery.eq('paiol_id', filtros.paiolId);
      }

      if (dataInicioFiltro) {
        retiradasQuery = retiradasQuery.gte('data_retirada', dataInicioFiltro);
      }

      if (dataFimFiltro) {
        const dataFimCompleta = new Date(dataFimFiltro);
        dataFimCompleta.setHours(23, 59, 59, 999);
        retiradasQuery = retiradasQuery.lte('data_retirada', dataFimCompleta.toISOString());
      }

      const { data: retiradasData, error: retiradasError } = await retiradasQuery;
      
      if (retiradasError) {
        console.error('Erro ao buscar retiradas:', retiradasError);
        throw retiradasError;
      }

      // Processar dados e agrupar por paiol
      const volumesPorPaiol = new Map<string, VolumePorPeriodo>();

      // Processar cubagens
      cubagemData?.forEach((cubagem: any) => {
        const paiolId = cubagem.paiol_id;
        const paiolNome = cubagem.paiols.nome;
        const periodo = `${dataInicioFiltro ? new Date(dataInicioFiltro).toLocaleDateString('pt-BR') : 'Início'} - ${dataFimFiltro ? new Date(dataFimFiltro).toLocaleDateString('pt-BR') : 'Fim'}`;
        
        if (!volumesPorPaiol.has(paiolId)) {
          volumesPorPaiol.set(paiolId, {
            paiol_id: paiolId,
            paiol_nome: paiolNome,
            periodo: periodo,
            volume_total_cubado: 0,
            volume_total_retirado: 0,
            volume_disponivel: 0,
            numero_retiradas: 0,
            retiradas_detalhadas: [],
          });
        }

        const volume = volumesPorPaiol.get(paiolId)!;
        volume.volume_total_cubado += Number(cubagem.volume_reduzido || 0);
      });

      // Processar retiradas
      retiradasData?.forEach((retirada: any) => {
        const paiolId = retirada.paiol_id;
        const paiolNome = retirada.paiols.nome;
        const periodo = `${dataInicioFiltro ? new Date(dataInicioFiltro).toLocaleDateString('pt-BR') : 'Início'} - ${dataFimFiltro ? new Date(dataFimFiltro).toLocaleDateString('pt-BR') : 'Fim'}`;
        
        if (!volumesPorPaiol.has(paiolId)) {
          volumesPorPaiol.set(paiolId, {
            paiol_id: paiolId,
            paiol_nome: paiolNome,
            periodo: periodo,
            volume_total_cubado: 0,
            volume_total_retirado: 0,
            volume_disponivel: 0,
            numero_retiradas: 0,
            retiradas_detalhadas: [],
          });
        }

        const volume = volumesPorPaiol.get(paiolId)!;
        volume.volume_total_retirado += Number(retirada.volume_retirado || 0);
        volume.numero_retiradas += 1;
        
        // Adicionar retirada detalhada
        volume.retiradas_detalhadas.push({
          id: retirada.id,
          data_retirada: retirada.data_retirada,
          cliente_nome: retirada.clientes.nome,
          volume_retirado: Number(retirada.volume_retirado || 0),
          valor_unitario: Number(retirada.valor_unitario || 0),
          valor_total: Number(retirada.valor_total || 0),
          status_pagamento: retirada.status_pagamento,
          motorista_nome: retirada.motorista_nome,
          placa_informada: retirada.placa_informada,
        });
      });

      // Calcular volumes disponíveis e ordenar retiradas por data
      volumesPorPaiol.forEach((volume) => {
        volume.volume_disponivel = volume.volume_total_cubado - volume.volume_total_retirado;
        volume.retiradas_detalhadas.sort((a, b) => new Date(b.data_retirada).getTime() - new Date(a.data_retirada).getTime());
      });

      return Array.from(volumesPorPaiol.values());
    },
    enabled: !!(filtros.dataInicio && filtros.dataFim) || !!filtros.paiolId || !!filtros.ciclo,
  });
};
