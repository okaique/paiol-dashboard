
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Wrench, Calendar, Building2, User, DollarSign, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useManutencoes } from '@/hooks/useManutencoes';
import { useEmpresasMetanicas } from '@/hooks/useEmpresasMetanicas';
import { useTiposManutencao } from '@/hooks/useTiposManutencao';

interface ManutencoesListProps {
  equipamentoId: string;
}

export function ManutencoesList({ equipamentoId }: ManutencoesListProps) {
  const { data: manutencoes, isLoading, error } = useManutencoes(equipamentoId);
  const { data: empresas } = useEmpresasMetanicas();
  const { data: tipos } = useTiposManutencao();

  const getEmpresa = (empresaId: string) => {
    return empresas?.find(empresa => empresa.id === empresaId);
  };

  const getTipo = (tipoId: string) => {
    return tipos?.find(tipo => tipo.id === tipoId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div>Carregando manutenções...</div>
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
            <p>Erro ao carregar manutenções.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!manutencoes || manutencoes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma manutenção registrada para este equipamento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {manutencoes.map((manutencao) => {
        const empresa = getEmpresa(manutencao.empresa_id);
        const tipo = getTipo(manutencao.tipo_id);
        
        return (
          <Card key={manutencao.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {tipo?.nome || 'Tipo não encontrado'}
                </CardTitle>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(manutencao.data), 'dd/MM/yyyy', { locale: ptBR })}
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
                      R$ {manutencao.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                {/* Empresa */}
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-semibold">
                      {empresa?.nome || 'Empresa não encontrada'}
                    </p>
                  </div>
                </div>

                {/* Responsável */}
                {manutencao.responsavel && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Responsável</p>
                      <p className="font-semibold">{manutencao.responsavel}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              {manutencao.observacoes && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Observações</p>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {manutencao.observacoes}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Anexos */}
              {manutencao.anexos && manutencao.anexos.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Anexos ({manutencao.anexos.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {manutencao.anexos.map((anexo, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          Anexo {index + 1}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
