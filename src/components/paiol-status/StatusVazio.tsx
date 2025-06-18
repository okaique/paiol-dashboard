
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import type { Paiol } from '@/types/database';

interface StatusVazioProps {
  paiol: Paiol;
}

export const StatusVazio = ({ paiol }: StatusVazioProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Status: Vazio</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          O paiol está vazio e pronto para iniciar uma nova dragagem.
        </p>
        {paiol.data_fechamento && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Último fechamento:</p>
            <p className="font-medium">
              {new Date(paiol.data_fechamento).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
