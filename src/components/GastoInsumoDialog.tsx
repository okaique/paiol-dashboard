
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GastoInsumoForm } from './GastoInsumoForm';

interface GastoInsumoDialogProps {
  dragagemId: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const GastoInsumoDialog = ({ dragagemId, children, onSuccess }: GastoInsumoDialogProps) => {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Gasto com Insumo</DialogTitle>
        </DialogHeader>
        <GastoInsumoForm
          dragagemId={dragagemId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
