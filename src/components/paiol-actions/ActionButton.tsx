
import { Button } from '@/components/ui/button';
import { DragagemDialog } from '@/components/DragagemDialog';
import { CubagemDialog } from '@/components/CubagemDialog';
import { FinalizarCicloDialog } from '@/components/FinalizarCicloDialog';
import { FinalizarDragagemDialog } from '@/components/FinalizarDragagemDialog';
import { PreparacaoNovoCicloDialog } from '@/components/PreparacaoNovoCicloDialog';
import { StatusTransitionDialog } from '@/components/StatusTransitionDialog';
import type { Paiol } from '@/types/database';

interface ActionButtonProps {
  action: {
    key: string;
    label: string;
    icon: any;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
    newStatus?: string;
    requiresCubagem?: boolean;
    specialAction?: string;
    disabled?: boolean;
  };
  paiol: Paiol;
  dragagemAtiva?: any;
  dragagemMaisRecente?: any;
  onUpdate?: () => void;
}

export const ActionButton = ({ action, paiol, dragagemAtiva, dragagemMaisRecente, onUpdate }: ActionButtonProps) => {
  const IconComponent = action.icon;

  if (action.key === 'start-dragagem') {
    return (
      <DragagemDialog paiol={paiol} onSuccess={onUpdate}>
        <Button variant={action.variant} className="w-full">
          <IconComponent className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      </DragagemDialog>
    );
  }

  // Ação para finalizar dragagem - usa FinalizarDragagemDialog
  if (action.key === 'finish-dragagem' && dragagemAtiva) {
    return (
      <FinalizarDragagemDialog
        dragagemId={dragagemAtiva.id}
        paiolNome={paiol.nome}
        onSuccess={onUpdate}
      >
        <Button variant={action.variant} className="w-full">
          <IconComponent className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      </FinalizarDragagemDialog>
    );
  }

  if (action.key === 'register-cubagem') {
    // Para paióls CHEIOS, usamos a dragagem mais recente
    const dragagemParaCubagem = paiol.status === 'CHEIO' ? dragagemMaisRecente : dragagemAtiva;
    
    if (dragagemParaCubagem) {
      return (
        <CubagemDialog 
          paiolId={paiol.id}
          dragagemId={dragagemParaCubagem.id}
          paiolNome={paiol.nome}
          onSuccess={onUpdate}
        >
          <Button variant={action.variant} className="w-full">
            <IconComponent className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        </CubagemDialog>
      );
    }
  }

  // Ação especial para finalizar ciclo
  if (action.specialAction === 'finish-cycle') {
    return (
      <FinalizarCicloDialog 
        paiol={paiol}
        onSuccess={onUpdate}
      >
        <Button variant={action.variant} className="w-full">
          <IconComponent className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      </FinalizarCicloDialog>
    );
  }

  // Ação especial para preparar novo ciclo
  if (action.specialAction === 'prepare-new-cycle') {
    return (
      <PreparacaoNovoCicloDialog 
        paiol={paiol}
        onSuccess={onUpdate}
      >
        <Button variant={action.variant} className="w-full">
          <IconComponent className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      </PreparacaoNovoCicloDialog>
    );
  }

  // Para ações de transição de status regulares
  if (action.newStatus) {
    return (
      <StatusTransitionDialog 
        paiol={paiol}
        newStatus={action.newStatus as any}
        onSuccess={onUpdate}
        requiresCubagem={action.requiresCubagem}
      >
        <Button 
          variant={action.variant} 
          className="w-full"
          disabled={action.disabled}
        >
          <IconComponent className="h-4 w-4 mr-2" />
          {action.label}
          {action.disabled && action.requiresCubagem && (
            <span className="ml-2 text-xs">(Requer Cubagem)</span>
          )}
        </Button>
      </StatusTransitionDialog>
    );
  }

  return null;
};
