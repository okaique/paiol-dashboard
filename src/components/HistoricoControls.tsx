
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HistoricoControlsProps {
  totalCiclos: number;
  modoVisualizacao: 'lista' | 'detalhado';
  onModoChange: (modo: 'lista' | 'detalhado') => void;
}

export const HistoricoControls = ({ 
  totalCiclos, 
  modoVisualizacao, 
  onModoChange 
}: HistoricoControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        {totalCiclos} ciclo{totalCiclos !== 1 ? 's' : ''}
      </Badge>
      
      <Button
        variant={modoVisualizacao === 'lista' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModoChange('lista')}
      >
        Lista
      </Button>
      <Button
        variant={modoVisualizacao === 'detalhado' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModoChange('detalhado')}
      >
        Detalhado
      </Button>
    </div>
  );
};
