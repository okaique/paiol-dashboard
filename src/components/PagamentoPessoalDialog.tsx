
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PagamentoPessoalForm } from './PagamentoPessoalForm';
import type { PagamentoPessoal } from '@/types/database';

interface PagamentoPessoalDialogProps {
  dragagemId: string;
  dragadorId: string;
  dragadorNome: string;
  ajudanteId?: string;
  ajudanteNome?: string;
  pagamento?: PagamentoPessoal;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const PagamentoPessoalDialog = ({
  dragagemId,
  dragadorId,
  dragadorNome,
  ajudanteId,
  ajudanteNome,
  pagamento,
  children,
  onSuccess,
}: PagamentoPessoalDialogProps) => {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? 'Editar Pagamento' : 'Novo Pagamento/Adiantamento'}
          </DialogTitle>
        </DialogHeader>
        
        <PagamentoPessoalForm
          dragagemId={dragagemId}
          dragadorId={dragadorId}
          dragadorNome={dragadorNome}
          ajudanteId={ajudanteId}
          ajudanteNome={ajudanteNome}
          pagamento={pagamento}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
