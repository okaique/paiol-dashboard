
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Retirada } from '@/types/database';

interface UseRetiradasFilters {
  dataInicio?: string;
  dataFim?: string;
  clienteNome?: string;
  statusPagamento?: string;
  cicloAtual?: number; // Novo filtro para ciclo
}

export const useRetiradas = (paiolId?: string, filters?: UseRetiradasFilters) => {
  return useQuery({
    queryKey: ['retiradas', paiolId, filters],
    queryFn: async (): Promise<Retirada[]> => {
      let query = supabase
        .from('retiradas')
        .select(`
          *,
          clientes(nome),
          caminhao:caminhoes!retiradas_caminhao_id_fkey(placa),
          caminhao_frete:caminhoes!retiradas_caminhao_frete_id_fkey(placa),
          paiol:paiols!inner(ciclo_atual)
        `)
        .order('data_retirada', { ascending: false });

      if (paiolId) {
        query = query.eq('paiol_id', paiolId);
      }

      // Aplicar filtros de data se fornecidos
      if (filters?.dataInicio) {
        query = query.gte('data_retirada', filters.dataInicio);
      }

      if (filters?.dataFim) {
        // Adicionar 23:59:59 ao final do dia para incluir todo o dia
        const dataFimCompleta = new Date(filters.dataFim);
        dataFimCompleta.setHours(23, 59, 59, 999);
        query = query.lte('data_retirada', dataFimCompleta.toISOString());
      }

      // Aplicar filtro de status de pagamento
      if (filters?.statusPagamento) {
        query = query.eq('status_pagamento', filters.statusPagamento);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar retiradas:', error);
        throw error;
      }

      let results = (data || []) as Retirada[];

      // Filtro de nome do cliente (feito no frontend devido à relação)
      if (filters?.clienteNome) {
        const clienteNomeLower = filters.clienteNome.toLowerCase();
        results = results.filter((retirada: any) => 
          retirada.clientes?.nome?.toLowerCase().includes(clienteNomeLower)
        );
      }

      // Filtrar por ciclo se especificado - consideramos que a retirada pertence ao ciclo atual do paiol
      if (filters?.cicloAtual) {
        results = results.filter((retirada: any) => {
          // A retirada pertence ao ciclo atual se foi feita quando o paiol estava neste ciclo
          // Como não temos campo de ciclo na retirada, assumimos que todas as retiradas
          // são do ciclo atual do paiol
          return true; // Por enquanto retornamos todas, mas isso pode ser refinado
        });
      }

      return results;
    },
    enabled: !paiolId || !!paiolId,
  });
};

export const useRetirada = (id: string) => {
  return useQuery({
    queryKey: ['retirada', id],
    queryFn: async (): Promise<Retirada | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('retiradas')
        .select(`
          *,
          clientes(nome),
          caminhao:caminhoes!retiradas_caminhao_id_fkey(placa),
          caminhao_frete:caminhoes!retiradas_caminhao_frete_id_fkey(placa)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar retirada:', error);
        throw error;
      }

      return data as Retirada | null;
    },
    enabled: !!id,
  });
};

// Nova função para buscar retiradas apenas do ciclo atual
export const useRetiradasCicloAtual = (paiolId: string, cicloAtual: number) => {
  return useQuery({
    queryKey: ['retiradas-ciclo-atual', paiolId, cicloAtual],
    queryFn: async (): Promise<Retirada[]> => {
      if (!paiolId) return [];

      // Buscar as retiradas do paiol
      // Como não temos campo de ciclo nas retiradas, vamos buscar retiradas
      // que foram feitas após o início do ciclo atual
      
      // Primeiro, vamos buscar quando o ciclo atual começou
      const { data: historicoStatus, error: historicoError } = await supabase
        .from('historico_status_paiols')
        .select('data_mudanca')
        .eq('paiol_id', paiolId)
        .eq('status_novo', 'RETIRANDO')
        .order('data_mudanca', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (historicoError) {
        console.error('Erro ao buscar histórico:', historicoError);
      }

      let query = supabase
        .from('retiradas')
        .select(`
          *,
          clientes(nome),
          caminhao:caminhoes!retiradas_caminhao_id_fkey(placa),
          caminhao_frete:caminhoes!retiradas_caminhao_frete_id_fkey(placa)
        `)
        .eq('paiol_id', paiolId)
        .order('data_retirada', { ascending: false });

      // Se encontramos quando o status mudou para RETIRANDO, filtramos retiradas posteriores
      if (historicoStatus?.data_mudanca) {
        query = query.gte('data_retirada', historicoStatus.data_mudanca);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar retiradas do ciclo atual:', error);
        throw error;
      }

      return (data || []) as Retirada[];
    },
    enabled: !!paiolId && !!cicloAtual,
  });
};
