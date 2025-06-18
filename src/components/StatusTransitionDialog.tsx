
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useStatusTransitions } from '@/hooks/useStatusTransitions';
import { useDragagemMaisRecente } from '@/hooks/useDragagens';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';
import type { Paiol, StatusPaiol } from '@/types/database';

interface StatusTransitionDialogProps {
  paiol: Paiol;
  newStatus: StatusPaiol;
  children: React.ReactNode;
  onSuccess?: () => void;
  requiresCubagem?: boolean;
}

export const StatusTransitionDialog = ({ 
  paiol, 
  newStatus, 
  children, 
  onSuccess,
  requiresCubagem = false 
}: StatusTransitionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { executeTransition } = useStatusTransitions();
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiol.id);
  const { data: cubagem } = useCubagemPorDragagem(dragagemMaisRecente?.id || '');

  console.log('StatusTransitionDialog - Paiol:', paiol.nome, 'Status atual:', paiol.status, 'Novo status:', newStatus);
  console.log('StatusTransitionDialog - Dragagem mais recente:', dragagemMaisRecente);
  console.log('StatusTransitionDialog - Cubagem encontrada:', cubagem);

  const handleConfirm = async () => {
    console.log('Executando transição de', paiol.status, 'para', newStatus);
    
    try {
      await executeTransition.mutateAsync({
        paiolId: paiol.id,
        newStatus,
      });
      
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Para transição CHEIO -> RETIRANDO, verificar se há cubagem
  const isBlockedByCubagem = paiol.status === 'CHEIO' && newStatus === 'RETIRANDO' && !cubagem;
  
  // Log da validação
  console.log('StatusTransitionDialog - Validação bloqueio:', {
    statusAtual: paiol.status,
    novoStatus: newStatus,
    temCubagem: !!cubagem,
    bloqueado: isBlockedByCubagem
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Transição de Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm">
            <p>
              <strong>Status atual:</strong> {paiol.status}
            </p>
            <p>
              <strong>Novo status:</strong> {newStatus}
            </p>
          </div>

          {isBlockedByCubagem && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cubagem Obrigatória</strong>
                <br />
                É necessário registrar a cubagem antes de iniciar as retiradas para controlar adequadamente o volume disponível.
              </AlertDescription>
            </Alert>
          )}

          {!isBlockedByCubagem && paiol.status === 'CHEIO' && newStatus === 'RETIRANDO' && cubagem && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Cubagem registrada com sucesso! Volume disponível: {cubagem.volume_reduzido?.toFixed(2)} m³
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isBlockedByCubagem || executeTransition.isPending}
            >
              {executeTransition.isPending ? 'Processando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
