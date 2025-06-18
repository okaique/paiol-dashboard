
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Calendar, User, FileText } from 'lucide-react';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';
import { GastoInsumoDialog } from './GastoInsumoDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GastosInsumosListProps {
  dragagemId: string;
}

export const GastosInsumosList = ({ dragagemId }: GastosInsumosListProps) => {
  const { data: gastos, isLoading, refetch } = useGastosInsumos(dragagemId);
  const { data: tiposInsumos } = useTiposInsumos();

  const getTipoInsumo = (tipoInsumoId: string) => {
    return tiposInsumos?.find(tipo => tipo.id === tipoInsumoId);
  };

  const totalGastos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gastos com Insumos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando gastos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gastos com Insumos
          </CardTitle>
          <GastoInsumoDialog dragagemId={dragagemId} onSuccess={refetch}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Gasto
            </Button>
          </GastoInsumoDialog>
        </div>
        {totalGastos > 0 && (
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">R$ {totalGastos.toFixed(2)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!gastos || gastos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum gasto registrado</p>
            <p className="text-sm">Clique em "Registrar Gasto" para adicionar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gastos.map((gasto) => {
              const tipoInsumo = getTipoInsumo(gasto.tipo_insumo_id);
              return (
                <div key={gasto.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">
                        {tipoInsumo?.nome || 'Insumo não encontrado'}
                      </h4>
                      {tipoInsumo && (
                        <Badge variant="secondary" className="text-xs">
                          {tipoInsumo.categoria}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {gasto.valor_total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {gasto.quantidade} {tipoInsumo?.unidade_medida} × R$ {gasto.valor_unitario.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(gasto.data_gasto), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    {gasto.fornecedor && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {gasto.fornecedor}
                      </div>
                    )}
                  </div>
                  
                  {gasto.observacoes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-muted-foreground">{gasto.observacoes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
