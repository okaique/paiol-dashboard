
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AbastecimentoForm } from './AbastecimentoForm';

interface AbastecimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamentoId: string;
}

export function AbastecimentoDialog({ 
  open, 
  onOpenChange, 
  equipamentoId 
}: AbastecimentoDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Abastecimento</DialogTitle>
        </DialogHeader>
        
        <AbastecimentoForm 
          equipamentoId={equipamentoId} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
