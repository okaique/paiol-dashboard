
import { useDragagens, useDragagemMaisRecente } from '@/hooks/useDragagens';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';
import { StatusVazio } from '@/components/paiol-status/StatusVazio';
import { StatusDragando } from '@/components/paiol-status/StatusDragando';
import { StatusCheio } from '@/components/paiol-status/StatusCheio';
import { StatusRetirando } from '@/components/paiol-status/StatusRetirando';
import type { Paiol } from '@/types/database';

interface PaiolStatusInfoProps {
  paiol: Paiol;
}

export const PaiolStatusInfo = ({ paiol }: PaiolStatusInfoProps) => {
  const { data: dragagens } = useDragagens(paiol.id);
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiol.id);
  const currentDragagem = dragagens?.find(d => !d.data_fim);
  
  const { data: cubagem } = useCubagemPorDragagem(dragagemMaisRecente?.id || '');

  const renderStatusSpecificInfo = () => {
    switch (paiol.status) {
      case 'VAZIO':
        return <StatusVazio paiol={paiol} />;

      case 'DRAGANDO':
        return <StatusDragando currentDragagem={currentDragagem} />;

      case 'CHEIO':
        return (
          <StatusCheio 
            paiol={paiol}
            dragagemMaisRecente={dragagemMaisRecente}
            cubagem={cubagem}
          />
        );

      case 'RETIRANDO':
        return (
          <StatusRetirando 
            paiol={paiol}
            dragagemMaisRecente={dragagemMaisRecente}
            cubagem={cubagem}
          />
        );

      default:
        return null;
    }
  };

  return renderStatusSpecificInfo();
};
