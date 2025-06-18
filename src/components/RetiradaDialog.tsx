
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RetiradaForm } from './RetiradaForm';
import { useCreateRetirada, useUpdateRetirada } from '@/hooks/useRetiradaMutations';
import { toast } from 'sonner';
import type { Retirada } from '@/types/database';

interface RetiradaDialogProps {
  paiolId: string;
  retirada?: Retirada;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RetiradaDialog = ({
  paiolId,
  retirada,
  isOpen,
  onClose,
  onSuccess,
}: RetiradaDialogProps) => {
  const createRetirada = useCreateRetirada();
  const updateRetirada = useUpdateRetirada();

  const handleSubmit = async (data: any) => {
    try {
      if (retirada) {
        await updateRetirada.mutateAsync({ id: retirada.id, ...data });
        toast.success('Retirada atualizada com sucesso!');
      } else {
        await createRetirada.mutateAsync(data);
        toast.success('Retirada registrada com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar retirada:', error);
      toast.error('Erro ao salvar retirada');
    }
  };

  const isLoading = createRetirada.isPending || updateRetirada.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {retirada ? 'Editar Retirada' : 'Nova Retirada'}
          </DialogTitle>
        </DialogHeader>
        <RetiradaForm
          paiolId={paiolId}
          retirada={retirada}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
