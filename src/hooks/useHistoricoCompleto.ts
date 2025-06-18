
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Paiol } from '@/types/database';

export interface EventoCompleto {
  id: string;
  data: string;
  tipo: 'TRANSICAO' | 'DRAGAGEM_INICIO' | 'DRAGAGEM_FIM' | 'CUBAGEM' | 'RETIRADA' | 'PAGAMENTO' | 'GASTO_INSUMO';
  titulo: string;
  descricao: string;
  detalhes?: Record<string, any>;
  ciclo?: number;
  responsavel?: string;
  valor?: number;
  observacoes?: string;
  status_anterior?: string;
  status_novo?: string;
  status_associado?: string;
  dragagem_id?: string;
}

interface FiltrosHistorico {
  dataInicio?: string;
  dataFim?: string;
  tiposEvento?: string[];
  ciclo?: number;
  responsavel?: string;
  comValor?: boolean;
  statusAssociado?: string;
  ordenacao?: 'asc' | 'desc';
}

export const useHistoricoCompleto = (paiol: Paiol, filtros?: FiltrosHistorico) => {
  return useQuery({
    queryKey: ['historico-completo', paiol.id, filtros],
    queryFn: async (): Promise<EventoCompleto[]> => {
      console.log('=== INICIANDO BUSCA DO HISTÓRICO COMPLETO ===');
      console.log('Paiol ID:', paiol.id);
      console.log('Filtros aplicados:', filtros);
      
      const eventos: EventoCompleto[] = [];

      // 1. Buscar transições de status
      const { data: transicoes } = await supabase
        .from('historico_status_paiols')
        .select('*')
        .eq('paiol_id', paiol.id)
        .order('data_mudanca', { ascending: false });

      console.log('Transições encontradas:', transicoes?.length);
      if (transicoes?.length > 0) {
        console.log('Primeira transição:', transicoes[0]);
      }

      // Para cada transição, determinar o ciclo baseado na data e fechamentos
      for (const transicao of transicoes || []) {
        console.log('Processando transição:', {
          id: transicao.id,
          data_mudanca: transicao.data_mudanca,
          data_mudanca_raw: transicao.data_mudanca
        });

        // Buscar fechamentos anteriores à data da transição para determinar o ciclo
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', transicao.data_mudanca)
          .order('data_fechamento', { ascending: false });

        const cicloTransicao = (fechamentosAnteriores?.length || 0) + 1;

        eventos.push({
          id: `transicao-${transicao.id}`,
          data: transicao.data_mudanca,
          tipo: 'TRANSICAO',
          titulo: `Mudança de Status: ${transicao.status_anterior || 'N/A'} → ${transicao.status_novo}`,
          descricao: getDescricaoTransicao(transicao.status_anterior, transicao.status_novo),
          status_anterior: transicao.status_anterior,
          status_novo: transicao.status_novo,
          status_associado: transicao.status_novo,
          observacoes: transicao.observacoes,
          ciclo: cicloTransicao,
        });
      }

      // 2. Buscar dragagens
      const { data: dragagens } = await supabase
        .from('dragagens')
        .select(`
          *,
          dragador:dragadores(nome),
          ajudante:ajudantes(nome)
        `)
        .eq('paiol_id', paiol.id)
        .order('data_inicio', { ascending: false });

      console.log('Dragagens encontradas:', dragagens?.length);
      if (dragagens?.length > 0) {
        console.log('Primeira dragagem:', {
          id: dragagens[0].id,
          data_inicio: dragagens[0].data_inicio,
          data_inicio_raw: dragagens[0].data_inicio,
          data_fim: dragagens[0].data_fim
        });
      }

      for (const dragagem of dragagens || []) {
        // Determinar ciclo da dragagem baseado na data de início
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', dragagem.data_inicio)
          .order('data_fechamento', { ascending: false });

        const cicloDragagem = (fechamentosAnteriores?.length || 0) + 1;

        // Evento de início
        eventos.push({
          id: `dragagem-inicio-${dragagem.id}`,
          data: dragagem.data_inicio,
          tipo: 'DRAGAGEM_INICIO',
          titulo: 'Início da Dragagem',
          descricao: `Dragagem iniciada com ${dragagem.dragador?.nome}${dragagem.ajudante ? ` e ajudante ${dragagem.ajudante.nome}` : ''}`,
          detalhes: {
            dragador: dragagem.dragador?.nome,
            ajudante: dragagem.ajudante?.nome,
          },
          status_associado: 'DRAGANDO',
          dragagem_id: dragagem.id,
          observacoes: dragagem.observacoes,
          ciclo: cicloDragagem,
        });

        // Evento de fim (se houver)
        if (dragagem.data_fim) {
          eventos.push({
            id: `dragagem-fim-${dragagem.id}`,
            data: dragagem.data_fim,
            tipo: 'DRAGAGEM_FIM',
            titulo: 'Finalização da Dragagem',
            descricao: `Dragagem finalizada por ${dragagem.dragador?.nome}`,
            detalhes: {
              dragador: dragagem.dragador?.nome,
              ajudante: dragagem.ajudante?.nome,
              duracao: calcularDuracao(dragagem.data_inicio, dragagem.data_fim),
            },
            status_associado: 'DRAGANDO',
            dragagem_id: dragagem.id,
            observacoes: dragagem.observacoes,
            ciclo: cicloDragagem,
          });
        }
      }

      // 3. Buscar cubagens
      const { data: cubagens } = await supabase
        .from('cubagens')
        .select('*, dragagens!inner(*)')
        .eq('paiol_id', paiol.id)
        .order('data_cubagem', { ascending: false });

      console.log('Cubagens encontradas:', cubagens?.length);
      if (cubagens?.length > 0) {
        console.log('Primeira cubagem:', {
          id: cubagens[0].id,
          data_cubagem: cubagens[0].data_cubagem,
          data_cubagem_raw: cubagens[0].data_cubagem
        });
      }

      for (const cubagem of cubagens || []) {
        // Determinar ciclo da cubagem baseado na data
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', cubagem.data_cubagem)
          .order('data_fechamento', { ascending: false });

        const cicloCubagem = (fechamentosAnteriores?.length || 0) + 1;

        eventos.push({
          id: `cubagem-${cubagem.id}`,
          data: cubagem.data_cubagem,
          tipo: 'CUBAGEM',
          titulo: 'Registro de Cubagem',
          descricao: `Volume calculado: ${cubagem.volume_reduzido.toFixed(2)} m³ (Volume normal: ${cubagem.volume_normal.toFixed(2)} m³)`,
          detalhes: {
            'Medida Inferior': `${cubagem.medida_inferior}m`,
            'Medida Superior': `${cubagem.medida_superior}m`,
            'Perímetro': `${cubagem.perimetro}m`,
            'Volume Normal': `${cubagem.volume_normal.toFixed(2)} m³`,
            'Volume Reduzido': `${cubagem.volume_reduzido.toFixed(2)} m³`,
          },
          status_associado: 'CHEIO',
          dragagem_id: cubagem.dragagem_id,
          observacoes: cubagem.observacoes,
          ciclo: cicloCubagem,
        });
      }

      // 4. Buscar retiradas
      const { data: retiradas } = await supabase
        .from('retiradas')
        .select(`
          *,
          clientes(nome)
        `)
        .eq('paiol_id', paiol.id)
        .order('data_retirada', { ascending: false });

      console.log('Retiradas encontradas:', retiradas?.length);
      if (retiradas?.length > 0) {
        console.log('Primeira retirada:', {
          id: retiradas[0].id,
          data_retirada: retiradas[0].data_retirada,
          data_retirada_raw: retiradas[0].data_retirada
        });
      }

      for (const retirada of retiradas || []) {
        // Determinar ciclo da retirada baseado na data
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', retirada.data_retirada)
          .order('data_fechamento', { ascending: false });

        const cicloRetirada = (fechamentosAnteriores?.length || 0) + 1;

        eventos.push({
          id: `retirada-${retirada.id}`,
          data: retirada.data_retirada,
          tipo: 'RETIRADA',
          titulo: 'Retirada de Areia',
          descricao: `${retirada.volume_retirado}m³ retirados por ${retirada.clientes?.nome || 'Cliente não informado'}`,
          detalhes: {
            'Cliente': retirada.clientes?.nome || 'Não informado',
            'Volume Retirado': `${retirada.volume_retirado} m³`,
            'Motorista': retirada.motorista_nome || 'Não informado',
            'Placa': retirada.placa_informada || 'Não informada',
            'Status Pagamento': retirada.status_pagamento === 'PAGO' ? 'Pago' : 'Não Pago',
            'Tem Frete': retirada.tem_frete ? 'Sim' : 'Não',
            'Valor Frete': retirada.valor_frete ? `R$ ${retirada.valor_frete.toFixed(2)}` : 'N/A',
            'Valor Unitário': retirada.valor_unitario ? `R$ ${retirada.valor_unitario.toFixed(2)}/m³` : 'N/A',
          },
          valor: retirada.valor_total,
          status_associado: 'RETIRANDO',
          observacoes: retirada.observacoes,
          ciclo: cicloRetirada,
        });
      }

      // 5. Buscar pagamentos de pessoal
      const { data: pagamentos } = await supabase
        .from('pagamentos_pessoal')
        .select(`
          *,
          dragagens!inner(paiol_id, data_inicio)
        `)
        .eq('dragagens.paiol_id', paiol.id)
        .order('data_pagamento', { ascending: false });

      console.log('Pagamentos encontrados:', pagamentos?.length);
      if (pagamentos?.length > 0) {
        console.log('Primeiro pagamento:', {
          id: pagamentos[0].id,
          data_pagamento: pagamentos[0].data_pagamento,
          data_pagamento_raw: pagamentos[0].data_pagamento
        });
      }

      for (const pagamento of pagamentos || []) {
        // Determinar ciclo do pagamento baseado na data
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', pagamento.data_pagamento)
          .order('data_fechamento', { ascending: false });

        const cicloPagamento = (fechamentosAnteriores?.length || 0) + 1;

        let nomePessoa = 'Pessoa não identificada';
        
        if (pagamento.tipo_pessoa === 'DRAGADOR') {
          const { data: dragador } = await supabase
            .from('dragadores')
            .select('nome')
            .eq('id', pagamento.pessoa_id)
            .single();
          nomePessoa = dragador?.nome || 'Dragador não encontrado';
        } else if (pagamento.tipo_pessoa === 'AJUDANTE') {
          const { data: ajudante } = await supabase
            .from('ajudantes')
            .select('nome')
            .eq('id', pagamento.pessoa_id)
            .single();
          nomePessoa = ajudante?.nome || 'Ajudante não encontrado';
        }

        eventos.push({
          id: `pagamento-${pagamento.id}`,
          data: pagamento.data_pagamento,
          tipo: 'PAGAMENTO',
          titulo: `Pagamento - ${nomePessoa}`,
          descricao: `${pagamento.tipo_pagamento === 'ADIANTAMENTO' ? 'Adiantamento' : 'Pagamento Final'} para ${pagamento.tipo_pessoa === 'DRAGADOR' ? 'dragador' : 'ajudante'} ${nomePessoa}`,
          detalhes: {
            'Pessoa': nomePessoa,
            'Tipo Pessoa': pagamento.tipo_pessoa === 'DRAGADOR' ? 'Dragador' : 'Ajudante',
            'Tipo Pagamento': pagamento.tipo_pagamento === 'ADIANTAMENTO' ? 'Adiantamento' : 'Pagamento Final',
            'Valor': `R$ ${pagamento.valor.toFixed(2)}`,
          },
          valor: pagamento.valor,
          status_associado: 'DRAGANDO',
          dragagem_id: pagamento.dragagem_id,
          observacoes: pagamento.observacoes,
          ciclo: cicloPagamento,
        });
      }

      // 6. Buscar gastos com insumos
      const { data: gastosInsumos } = await supabase
        .from('gastos_insumos')
        .select(`
          *,
          tipos_insumos(nome, categoria),
          dragagens!inner(paiol_id, data_inicio)
        `)
        .eq('dragagens.paiol_id', paiol.id)
        .order('data_gasto', { ascending: false });

      console.log('Gastos com insumos encontrados:', gastosInsumos?.length);
      if (gastosInsumos?.length > 0) {
        console.log('Primeiro gasto:', {
          id: gastosInsumos[0].id,
          data_gasto: gastosInsumos[0].data_gasto,
          data_gasto_raw: gastosInsumos[0].data_gasto
        });
      }

      for (const gasto of gastosInsumos || []) {
        // Determinar ciclo do gasto baseado na data
        const { data: fechamentosAnteriores } = await supabase
          .from('fechamentos')
          .select('data_fechamento')
          .eq('paiol_id', paiol.id)
          .lt('data_fechamento', gasto.data_gasto)
          .order('data_fechamento', { ascending: false });

        const cicloGasto = (fechamentosAnteriores?.length || 0) + 1;

        eventos.push({
          id: `gasto-insumo-${gasto.id}`,
          data: gasto.data_gasto,
          tipo: 'GASTO_INSUMO',
          titulo: `Gasto com ${gasto.tipos_insumos?.nome || 'Insumo'}`,
          descricao: `${gasto.quantidade} ${gasto.tipos_insumos?.categoria || 'unidades'} de ${gasto.tipos_insumos?.nome} - ${gasto.fornecedor || 'Fornecedor não informado'}`,
          detalhes: {
            'Insumo': gasto.tipos_insumos?.nome || 'Não informado',
            'Categoria': gasto.tipos_insumos?.categoria || 'Não informada',
            'Quantidade': gasto.quantidade,
            'Valor Unitário': `R$ ${gasto.valor_unitario.toFixed(2)}`,
            'Valor Total': `R$ ${gasto.valor_total.toFixed(2)}`,
            'Fornecedor': gasto.fornecedor || 'Não informado',
          },
          valor: gasto.valor_total,
          status_associado: 'DRAGANDO',
          dragagem_id: gasto.dragagem_id,
          observacoes: gasto.observacoes,
          ciclo: cicloGasto,
        });
      }

      // Aplicar filtros
      let eventosFiltrados = eventos;

      // Filtro por ciclo específico
      if (filtros?.ciclo) {
        eventosFiltrados = eventosFiltrados.filter(evento => evento.ciclo === filtros.ciclo);
        console.log(`Filtrados por ciclo ${filtros.ciclo}:`, eventosFiltrados.length, 'eventos');
      }

      if (filtros?.dataInicio) {
        eventosFiltrados = eventosFiltrados.filter(evento => 
          new Date(evento.data) >= new Date(filtros.dataInicio!)
        );
      }

      if (filtros?.dataFim) {
        const dataFimCompleta = new Date(filtros.dataFim);
        dataFimCompleta.setHours(23, 59, 59, 999);
        eventosFiltrados = eventosFiltrados.filter(evento => 
          new Date(evento.data) <= dataFimCompleta
        );
      }

      if (filtros?.tiposEvento && filtros.tiposEvento.length > 0) {
        eventosFiltrados = eventosFiltrados.filter(evento => 
          filtros.tiposEvento!.includes(evento.tipo)
        );
      }

      if (filtros?.statusAssociado) {
        eventosFiltrados = eventosFiltrados.filter(evento => 
          evento.status_associado === filtros.statusAssociado
        );
      }

      if (filtros?.comValor) {
        eventosFiltrados = eventosFiltrados.filter(evento => 
          evento.valor !== undefined && evento.valor > 0
        );
      }

      // Aplicar ordenação
      const ordenacao = filtros?.ordenacao || 'desc';
      eventosFiltrados.sort((a, b) => {
        const dataA = new Date(a.data).getTime();
        const dataB = new Date(b.data).getTime();
        return ordenacao === 'desc' ? dataB - dataA : dataA - dataB;
      });

      console.log('=== RESULTADO FINAL ===');
      console.log(`Total de eventos: ${eventos.length}`);
      console.log(`Eventos filtrados: ${eventosFiltrados.length}`);
      console.log('Primeiros 3 eventos (com datas):', eventosFiltrados.slice(0, 3).map(e => ({
        tipo: e.tipo,
        titulo: e.titulo,
        data: e.data,
        data_formatada: new Date(e.data).toLocaleString('pt-BR')
      })));
      
      return eventosFiltrados;
    },
  });
};

const getDescricaoTransicao = (statusAnterior: string | null, statusNovo: string): string => {
  if (statusAnterior === null && statusNovo === 'DRAGANDO') {
    return 'Paiol iniciou processo de dragagem';
  }
  if (statusAnterior === 'VAZIO' && statusNovo === 'DRAGANDO') {
    return 'Paiol iniciou processo de dragagem';
  }
  if (statusAnterior === 'DRAGANDO' && statusNovo === 'CHEIO') {
    return 'Dragagem finalizada, paiol está cheio';
  }
  if (statusAnterior === 'CHEIO' && statusNovo === 'RETIRANDO') {
    return 'Paiol liberado para retiradas';
  }
  if (statusAnterior === 'RETIRANDO' && statusNovo === 'VAZIO') {
    return 'Ciclo finalizado, paiol está vazio';
  }
  return `Mudança de ${statusAnterior || 'N/A'} para ${statusNovo}`;
};

const calcularDuracao = (inicio: string, fim: string): string => {
  const diffMs = new Date(fim).getTime() - new Date(inicio).getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDias > 0) {
    return `${diffDias} dia${diffDias > 1 ? 's' : ''} e ${diffHoras}h`;
  }
  return `${diffHoras}h`;
};
