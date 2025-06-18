
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DragagemFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const DragagemFormActions = ({ isLoading, onCancel }: DragagemFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Iniciar Dragagem
      </Button>
    </div>
  );
};
