
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CubagemForm } from './CubagemForm';

interface CubagemDialogProps {
  paiolId: string;
  dragagemId: string;
  paiolNome: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const CubagemDialog = ({ paiolId, dragagemId, paiolNome, children, onSuccess }: CubagemDialogProps) => {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Cubagem</DialogTitle>
        </DialogHeader>
        <CubagemForm
          paiolId={paiolId}
          dragagemId={dragagemId}
          paiolNome={paiolNome}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
