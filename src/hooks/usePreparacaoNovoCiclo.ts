
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PreparacaoNovoCicloData {
  paiolId: string;
  observacoes?: string;
}

export const usePreparacaoNovoCiclo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const preparaNovoCiclo = useMutation({
    mutationFn: async (data: PreparacaoNovoCicloData) => {
      console.log('Preparando paiol para novo ciclo:', data);
      
      // 1. Verificar se o paiol está no status correto
      const { data: paiol, error: paiolError } = await supabase
        .from('paiols')
        .select('status, ciclo_atual')
        .eq('id', data.paiolId)
        .single();

      if (paiolError) {
        console.error('Erro ao buscar paiol:', paiolError);
        throw new Error('Erro ao buscar informações do paiol');
      }

      if (paiol.status !== 'VAZIO') {
        throw new Error('O paiol deve estar com status VAZIO para preparar novo ciclo');
      }

      // 2. Arquivar dados do ciclo anterior se necessário
      const cicloAnterior = paiol.ciclo_atual - 1;
      
      if (cicloAnterior > 0) {
        // Registrar arquivamento no histórico
        const { error: historicoError } = await supabase
          .from('historico_status_paiols')
          .insert({
            paiol_id: data.paiolId,
            status_anterior: 'VAZIO',
            status_novo: 'VAZIO',
            observacoes: `Preparação para Ciclo ${paiol.ciclo_atual} - Arquivamento do Ciclo ${cicloAnterior}. ${data.observacoes || ''}`,
          });

        if (historicoError) {
          console.error('Erro ao registrar arquivamento:', historicoError);
          throw new Error('Erro ao registrar arquivamento no histórico');
        }
      }

      // 3. Limpar dados temporários se necessário (opcional - para futuras implementações)
      // Por enquanto, apenas registramos a preparação

      // 4. Marcar paiol como preparado para novo ciclo
      const { error: updateError } = await supabase
        .from('paiols')
        .update({
          data_abertura: null, // Reset da data de abertura
          observacoes: `Preparado para Ciclo ${paiol.ciclo_atual} - ${data.observacoes || 'Paiol pronto para nova dragagem'}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.paiolId);

      if (updateError) {
        console.error('Erro ao atualizar paiol:', updateError);
        throw new Error('Erro ao preparar paiol para novo ciclo');
      }

      return { 
        paiolId: data.paiolId, 
        cicloAtual: paiol.ciclo_atual,
        preparado: true 
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      queryClient.invalidateQueries({ queryKey: ['paiol', result.paiolId] });
      queryClient.invalidateQueries({ queryKey: ['historico-status'] });
      
      toast({
        title: "Sucesso",
        description: `Paiol preparado para o Ciclo ${result.cicloAtual}! Pronto para nova dragagem.`,
      });
    },
    onError: (error: any) => {
      console.error('Erro na preparação para novo ciclo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao preparar paiol para novo ciclo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    preparaNovoCiclo,
    isLoading: preparaNovoCiclo.isPending,
  };
};
