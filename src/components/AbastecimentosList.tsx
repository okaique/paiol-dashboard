
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Fuel, Calendar, User, DollarSign, Gauge } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAbastecimentos } from '@/hooks/useAbastecimentos';

interface AbastecimentosListProps {
  equipamentoId: string;
}

export function AbastecimentosList({ equipamentoId }: AbastecimentosListProps) {
  const { data: abastecimentos, isLoading, error } = useAbastecimentos(equipamentoId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div>Carregando abastecimentos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <p>Erro ao carregar abastecimentos.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!abastecimentos || abastecimentos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Fuel className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum abastecimento registrado para este equipamento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {abastecimentos.map((abastecimento) => (
        <Card key={abastecimento.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Abastecimento
              </CardTitle>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(abastecimento.data), 'dd/MM/yyyy', { locale: ptBR })}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Valor */}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-semibold">
                    R$ {abastecimento.valor.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Litragem */}
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Litragem</p>
                  <p className="font-semibold">{abastecimento.litragem}L</p>
                </div>
              </div>

              {/* KM Atual */}
              {abastecimento.km_atual && (
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">KM</p>
                    <p className="font-semibold">
                      {abastecimento.km_atual.toFixed(0)} km
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Responsável */}
            {abastecimento.responsavel && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="text-sm">{abastecimento.responsavel}</p>
                  </div>
                </div>
              </>
            )}

            {/* Observações */}
            {abastecimento.observacoes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {abastecimento.observacoes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
