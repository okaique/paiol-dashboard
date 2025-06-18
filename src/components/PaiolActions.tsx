
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePaiolActions } from '@/hooks/usePaiolActions';
import { getStatusColor } from '@/components/paiol-actions/PaiolStatusUtils';
import { ActionButton } from '@/components/paiol-actions/ActionButton';
import { EmptyState } from '@/components/paiol-actions/EmptyState';
import type { Paiol } from '@/types/database';

interface PaiolActionsProps {
  paiol: Paiol;
  onUpdate?: () => void;
}

export const PaiolActions = ({ paiol, onUpdate }: PaiolActionsProps) => {
  const { actions, dragagemAtiva, dragagemMaisRecente, cubagem } = usePaiolActions(paiol);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Ações
          <Badge className={getStatusColor(paiol.status)}>
            {paiol.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            paiol={paiol}
            dragagemAtiva={dragagemAtiva}
            dragagemMaisRecente={dragagemMaisRecente}
            onUpdate={onUpdate}
          />
        ))}

        {actions.length === 0 && (
          <EmptyState paiol={paiol} dragagemAtiva={dragagemAtiva} />
        )}
      </CardContent>
    </Card>
  );
};
