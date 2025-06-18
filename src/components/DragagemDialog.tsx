
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragagemForm } from './DragagemForm';
import type { Paiol } from '@/types/database';

interface DragagemDialogProps {
  paiol: Paiol;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const DragagemDialog = ({ paiol, children, onSuccess }: DragagemDialogProps) => {
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
          <DialogTitle>Iniciar Dragagem</DialogTitle>
        </DialogHeader>
        <DragagemForm
          paiol={paiol}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
