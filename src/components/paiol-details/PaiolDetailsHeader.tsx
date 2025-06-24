
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Paiol } from '@/types/database';

interface PaiolDetailsHeaderProps {
  paiol: Paiol;
}

export const PaiolDetailsHeader = ({ paiol }: PaiolDetailsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{paiol.nome}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={
              paiol.status === 'VAZIO' ? 'secondary' :
              paiol.status === 'DRAGANDO' ? 'default' :
              paiol.status === 'CHEIO' ? 'destructive' :
              'outline'
            }>
              {paiol.status}
            </Badge>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-sm text-muted-foreground">
              Ciclo Atual: {paiol.ciclo_atual || 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
