import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { StatusPaiol } from '@/types/database';

interface StatusTransitionData {
  paiolId: string;
  newStatus: StatusPaiol;
  dragadorId?: string;
  ajudanteId?: string;
  observacoes?: string;
  usuarioId?: string;
}

export const useStatusTransitions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const executeTransition = useMutation({
    mutationFn: async (data: StatusTransitionData) => {
      console.log('Executando transição de status:', data);
      
      // Usar NOW() do banco para garantir consistência de data/hora
      const { data: result, error } = await supabase.rpc('execute_status_transition', {
        p_paiol_id: data.paiolId,
        p_new_status: data.newStatus,
        p_dragador_id: data.dragadorId || null,
        p_ajudante_id: data.ajudanteId || null,
        p_observacoes: data.observacoes || null,
        p_usuario_id: data.usuarioId || null,
      });

      if (error) {
        console.error('Erro na transição de status:', error);
        throw error;
      }

      console.log('Transição executada com sucesso:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas ao histórico para forçar recarga
      queryClient.invalidateQueries({ queryKey: ['paiols'] });
      queryClient.invalidateQueries({ queryKey: ['dragagens'] });
      queryClient.invalidateQueries({ queryKey: ['historico-status'] });
      queryClient.invalidateQueries({ queryKey: ['historico-completo'] });
      queryClient.invalidateQueries({ queryKey: ['historico-ciclos'] });
      queryClient.invalidateQueries({ queryKey: ['cubagens'] });
      queryClient.invalidateQueries({ queryKey: ['retiradas'] });
      
      const statusLabels: Record<StatusPaiol, string> = {
        'VAZIO': 'Vazio',
        'DRAGANDO': 'Dragando', 
        'CHEIO': 'Cheio',
        'RETIRANDO': 'Retirando'
      };

      let message = `Status alterado para ${statusLabels[variables.newStatus]}!`;
      
      if (variables.newStatus === 'RETIRANDO') {
        message = 'Paiol liberado para retiradas de areia!';
      } else if (variables.newStatus === 'VAZIO') {
        message = 'Ciclo finalizado com sucesso! Paiol pronto para nova dragagem.';
      }
      
      toast({
        title: "Sucesso",
        description: message,
      });
    },
    onError: (error: any) => {
      console.error('Erro na transição:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status do paiol. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const getAvailableTransitions = (currentStatus: StatusPaiol): StatusPaiol[] => {
    const transitions: Record<StatusPaiol, StatusPaiol[]> = {
      'VAZIO': ['DRAGANDO'],
      'DRAGANDO': ['CHEIO'],
      'CHEIO': ['RETIRANDO'],
      'RETIRANDO': ['VAZIO'],
    };

    return transitions[currentStatus] || [];
  };

  const getTransitionRequirements = (fromStatus: StatusPaiol, toStatus: StatusPaiol) => {
    if (fromStatus === 'VAZIO' && toStatus === 'DRAGANDO') {
      return { requiresDragador: true, requiresAjudante: false };
    }
    return { requiresDragador: false, requiresAjudante: false };
  };

  const canTransition = (fromStatus: StatusPaiol, toStatus: StatusPaiol, hasCubagem?: boolean) => {
    console.log('canTransition - Verificando transição:', { fromStatus, toStatus, hasCubagem });
    
    // Verificar se a transição é válida primeiro
    const validTransitions = getAvailableTransitions(fromStatus);
    if (!validTransitions.includes(toStatus)) {
      console.log('canTransition - Transição não válida');
      return false;
    }
    
    // Validação específica para CHEIO → RETIRANDO
    if (fromStatus === 'CHEIO' && toStatus === 'RETIRANDO') {
      const canMakeTransition = hasCubagem === true;
      console.log('canTransition - CHEIO → RETIRANDO:', { hasCubagem, canMakeTransition });
      return canMakeTransition;
    }
    
    return true;
  };

  return {
    executeTransition,
    getAvailableTransitions,
    getTransitionRequirements,
    canTransition,
    isLoading: executeTransition.isPending,
  };
};
