
import { Button } from '@/components/ui/button';

interface GastoFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const GastoFormActions = ({ isSubmitting, onCancel }: GastoFormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar Gasto'}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
};
