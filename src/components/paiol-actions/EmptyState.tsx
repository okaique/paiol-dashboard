
import type { Paiol } from '@/types/database';

interface EmptyStateProps {
  paiol: Paiol;
  dragagemAtiva?: any;
}

export const EmptyState = ({ paiol, dragagemAtiva }: EmptyStateProps) => {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-muted-foreground">
        Nenhuma ação disponível para o status atual.
      </p>
    </div>
  );
};
