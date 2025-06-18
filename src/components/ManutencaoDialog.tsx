
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ManutencaoForm } from './ManutencaoForm';

interface ManutencaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamentoId: string;
}

export function ManutencaoDialog({ 
  open, 
  onOpenChange, 
  equipamentoId 
}: ManutencaoDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Manutenção</DialogTitle>
        </DialogHeader>
        
        <ManutencaoForm 
          equipamentoId={equipamentoId} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}
