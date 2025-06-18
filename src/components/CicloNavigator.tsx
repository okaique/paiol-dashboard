
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface CicloNavigatorProps {
  cicloAtual: number;
  cicloSelecionado: number;
  totalCiclos: number;
  onCicloChange: (ciclo: number) => void;
  onResetToAtual: () => void;
}

export const CicloNavigator = ({ 
  cicloAtual, 
  cicloSelecionado, 
  totalCiclos, 
  onCicloChange,
  onResetToAtual 
}: CicloNavigatorProps) => {
  const canGoPrevious = cicloSelecionado > 1;
  const canGoNext = cicloSelecionado < cicloAtual;

  return (
    <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCicloChange(cicloSelecionado - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Ciclo</span>
            <Badge variant={cicloSelecionado === cicloAtual ? 'default' : 'secondary'}>
              {cicloSelecionado}
              {cicloSelecionado === cicloAtual && ' (Atual)'}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCicloChange(cicloSelecionado + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          de {totalCiclos} ciclo{totalCiclos !== 1 ? 's' : ''}
        </div>
      </div>

      {cicloSelecionado !== cicloAtual && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetToAtual}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Voltar ao Atual
        </Button>
      )}
    </div>
  );
};
