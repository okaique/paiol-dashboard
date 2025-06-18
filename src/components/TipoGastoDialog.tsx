
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TipoGastoForm } from './TipoGastoForm';
import type { TipoGasto } from '@/types/database';

interface TipoGastoDialogProps {
  tipoGasto?: TipoGasto;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const TipoGastoDialog = ({ tipoGasto, children, onSuccess }: TipoGastoDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tipoGasto ? 'Editar Tipo de Gasto' : 'Novo Tipo de Gasto'}
          </DialogTitle>
        </DialogHeader>
        <TipoGastoForm
          tipoGasto={tipoGasto}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
