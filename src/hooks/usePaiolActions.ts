
import { Play, Square, Truck, RotateCcw, Calculator, RefreshCw } from 'lucide-react';
import type { Paiol } from '@/types/database';
import { useDragagemAtiva, useDragagemMaisRecente } from '@/hooks/useDragagens';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';

interface PaiolAction {
  key: string;
  label: string;
  icon: any;
  variant: 'default' | 'outline' | 'secondary' | 'destructive';
  newStatus?: string;
  requiresDragador?: boolean;
  requiresCubagem?: boolean;
  specialAction?: string;
  show?: boolean;
  disabled?: boolean;
}

export const usePaiolActions = (paiol: Paiol) => {
  const { data: dragagemAtiva } = useDragagemAtiva(paiol.id);
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiol.id);
  
  // Para paióls CHEIOS, usamos a dragagem mais recente para verificar cubagem
  const dragagemParaCubagem = paiol.status === 'CHEIO' ? dragagemMaisRecente : dragagemAtiva;
  const { data: cubagem } = useCubagemPorDragagem(dragagemParaCubagem?.id || '');

  console.log('Analisando ações para paiol:', paiol.nome, 'Status:', paiol.status);
  console.log('Dragagem ativa:', dragagemAtiva);
  console.log('Dragagem mais recente:', dragagemMaisRecente);

  const getAvailableActions = (): PaiolAction[] => {
    switch (paiol.status) {
      case 'VAZIO':
        return [
          {
            key: 'start-dragagem',
            label: 'Iniciar Dragagem',
            icon: Play,
            variant: 'default' as const,
            requiresDragador: true,
          },
          {
            key: 'prepare-new-cycle',
            label: 'Preparar Novo Ciclo',
            icon: RefreshCw,
            variant: 'outline' as const,
            specialAction: 'prepare-new-cycle',
            show: paiol.ciclo_atual > 1,
          }
        ].filter(action => action.show !== false);
      
      case 'DRAGANDO':
        return [
          {
            key: 'finish-dragagem',
            label: 'Finalizar Dragagem',
            icon: Square,
            variant: 'secondary' as const,
            newStatus: 'CHEIO',
          }
        ];
      
      case 'CHEIO':
        const actions: PaiolAction[] = [];
        
        // Para paióls CHEIOS, verificamos se há dragagem finalizada e se não há cubagem
        if (dragagemMaisRecente && !cubagem) {
          actions.push({
            key: 'register-cubagem',
            label: 'Registrar Cubagem',
            icon: Calculator,
            variant: 'outline' as const,
            requiresCubagem: true,
          });
        }
        
        // Botão para iniciar retiradas - SEMPRE aparece se houver dragagem mais recente
        // A validação de cubagem será feita no dialog de transição
        if (dragagemMaisRecente) {
          actions.push({
            key: 'start-retirando',
            label: 'Iniciar Retiradas',
            icon: Truck,
            variant: 'default' as const,
            newStatus: 'RETIRANDO',
            disabled: !cubagem, // Desabilitado se não houver cubagem
          });
        }
        
        return actions;
      
      case 'RETIRANDO':
        return [
          {
            key: 'finish-cycle',
            label: 'Finalizar Ciclo',
            icon: RotateCcw,
            variant: 'destructive' as const,
            specialAction: 'finish-cycle',
          }
        ];
      
      default:
        return [];
    }
  };

  return {
    actions: getAvailableActions(),
    dragagemAtiva,
    dragagemMaisRecente,
    cubagem,
  };
};
