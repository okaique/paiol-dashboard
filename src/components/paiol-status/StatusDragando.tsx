
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, User, UserCheck } from 'lucide-react';
import type { Dragagem } from '@/types/database';

interface StatusDragandoProps {
  currentDragagem?: Dragagem;
}

export const StatusDragando = ({ currentDragagem }: StatusDragandoProps) => {
  // Forçar o tipo correto da dragagem com joins
  const dragagem = currentDragagem as any;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Status: Dragando</span>
          <Badge variant="default" className="bg-blue-500">
            Em Andamento
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dragagem ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Início</p>
                <p className="font-medium">
                  {new Date(dragagem.data_inicio).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="font-medium">
                  {Math.ceil((new Date().getTime() - new Date(dragagem.data_inicio).getTime()) / (1000 * 60 * 60 * 24))} dias
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Dragador</p>
                  <Badge variant="secondary">
                    {dragagem.dragador?.nome || `ID: ${dragagem.dragador_id.substring(0, 8)}`}
                    {dragagem.dragador?.valor_diaria && (
                      <span className="ml-2 text-xs">
                        R$ {dragagem.dragador.valor_diaria.toFixed(2)}/dia
                      </span>
                    )}
                  </Badge>
                </div>
              </div>

              {dragagem.ajudante_id && (
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ajudante</p>
                    <Badge variant="outline">
                      {dragagem.ajudante?.nome || `ID: ${dragagem.ajudante_id.substring(0, 8)}`}
                      {dragagem.ajudante?.valor_diaria && (
                        <span className="ml-2 text-xs">
                          R$ {dragagem.ajudante.valor_diaria.toFixed(2)}/dia
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {dragagem.observacoes && (
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-sm bg-muted p-3 rounded-md">{dragagem.observacoes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <Activity className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-muted-foreground">
              Dragagem em andamento
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Carregando detalhes da dragagem ativa...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
