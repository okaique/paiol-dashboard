
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TipoInsumoForm } from './TipoInsumoForm';
import type { TipoInsumo } from '@/types/database';

interface TipoInsumoDialogProps {
  tipoInsumo?: TipoInsumo;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const TipoInsumoDialog = ({ tipoInsumo, children, onSuccess }: TipoInsumoDialogProps) => {
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
            {tipoInsumo ? 'Editar Tipo de Insumo' : 'Novo Tipo de Insumo'}
          </DialogTitle>
        </DialogHeader>
        <TipoInsumoForm
          tipoInsumo={tipoInsumo}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
