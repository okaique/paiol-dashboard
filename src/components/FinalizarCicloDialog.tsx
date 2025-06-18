
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStatusTransitions } from '@/hooks/useStatusTransitions';
import { useVolumeControl } from '@/hooks/useVolumeControl';
import { useDragagemMaisRecente } from '@/hooks/useDragagens';
import type { Paiol } from '@/types/database';
import { ArrowRight, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface FinalizarCicloDialogProps {
  paiol: Paiol;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const FinalizarCicloDialog = ({ 
  paiol, 
  children, 
  onSuccess 
}: FinalizarCicloDialogProps) => {
  const [open, setOpen] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const { executeTransition, isLoading } = useStatusTransitions();
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiol.id);
  const volumeControl = useVolumeControl(paiol.id, dragagemMaisRecente?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await executeTransition.mutateAsync({
        paiolId: paiol.id,
        newStatus: 'VAZIO',
        observacoes: observacoes || `Finalização do Ciclo ${paiol.ciclo_atual}`,
      });
      
      setOpen(false);
      setObservacoes('');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao finalizar ciclo:', error);
    }
  };

  const getVolumeStatus = () => {
    const { volumeTotal, volumeRetirado, percentualUtilizado } = volumeControl;
    
    if (percentualUtilizado >= 95) {
      return {
        status: 'complete',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        icon: CheckCircle,
        message: 'Volume totalmente utilizado - Pronto para fechamento'
      };
    } else if (percentualUtilizado >= 80) {
      return {
        status: 'warning',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        icon: AlertTriangle,
        message: `${percentualUtilizado.toFixed(1)}% do volume foi utilizado - Ainda há ${(volumeTotal - volumeRetirado).toFixed(2)} m³ disponíveis`
      };
    } else {
      return {
        status: 'alert',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        icon: AlertTriangle,
        message: `Apenas ${percentualUtilizado.toFixed(1)}% do volume foi utilizado - Restam ${(volumeTotal - volumeRetirado).toFixed(2)} m³`
      };
    }
  };

  const volumeStatus = getVolumeStatus();
  const StatusIcon = volumeStatus.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            <span>Finalizar Ciclo - {paiol.nome}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Visualização da transição */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                RETIRANDO
              </div>
              <div className="text-sm text-muted-foreground">Status Atual</div>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">
                VAZIO
              </div>
              <div className="text-sm text-muted-foreground">Novo Status</div>
            </div>
          </div>

          {/* Resumo do Ciclo */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Resumo do Ciclo {paiol.ciclo_atual}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-600">Volume Total:</span>
                <p className="font-medium">{volumeControl.volumeTotal.toFixed(2)} m³</p>
              </div>
              <div>
                <span className="text-blue-600">Volume Retirado:</span>
                <p className="font-medium">{volumeControl.volumeRetirado.toFixed(2)} m³</p>
              </div>
              <div>
                <span className="text-blue-600">Aproveitamento:</span>
                <p className="font-medium">{volumeControl.percentualUtilizado.toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-blue-600">Próximo Ciclo:</span>
                <p className="font-medium">{paiol.ciclo_atual + 1}</p>
              </div>
            </div>
          </div>

          {/* Status do Volume */}
          <Alert className={volumeStatus.bgColor}>
            <StatusIcon className={`h-4 w-4 ${volumeStatus.color}`} />
            <AlertDescription>
              <p className={`font-medium ${volumeStatus.color}`}>Status do Volume</p>
              <p className="text-sm mt-1">{volumeStatus.message}</p>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações de Fechamento</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder={`Finalização do Ciclo ${paiol.ciclo_atual} - Adicione observações sobre o fechamento...`}
                rows={3}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">Atenção</p>
                <p className="text-sm mt-1">
                  Esta ação finalizará o ciclo atual e iniciará o Ciclo {paiol.ciclo_atual + 1}. 
                  O paiol ficará disponível para uma nova dragagem.
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? 'Finalizando...' : 'Finalizar Ciclo'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
