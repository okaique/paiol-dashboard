import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Calendar, TrendingUp } from 'lucide-react';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface CustosDragagemProps {
  dragagemId: string;
}
export const CustosDragagem = ({
  dragagemId
}: CustosDragagemProps) => {
  const {
    data: gastos,
    isLoading: loadingGastos
  } = useGastosInsumos(dragagemId);
  const {
    data: pagamentos,
    isLoading: loadingPagamentos
  } = usePagamentosPessoal(dragagemId);
  const {
    data: tiposInsumos
  } = useTiposInsumos();
  const getTipoInsumo = (tipoInsumoId: string) => {
    return tiposInsumos?.find(tipo => tipo.id === tipoInsumoId);
  };
  if (loadingGastos || loadingPagamentos) {
    return <Card>
        <CardHeader>
          <CardTitle>Custos da Dragagem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando custos...</p>
        </CardContent>
      </Card>;
  }
  const totalGastosInsumos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;
  const totalPagamentos = pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  return <div className="space-y-6">
      {/* Resumo dos Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">Gastos com Insumos</p>
              <p className="text-xl font-bold text-blue-600">R$ {totalGastosInsumos.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{gastos?.length || 0} registros</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Pagamentos</p>
              <p className="text-xl font-bold text-green-600">R$ {totalPagamentos.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{pagamentos?.length || 0} pagamentos</p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Total Geral</p>
              <p className="text-xl font-bold text-primary">R$ {(totalGastosInsumos + totalPagamentos).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Custo total da dragagem</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimos Gastos com Insumos */}
      {gastos && gastos.length > 0 && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Últimos Gastos com Insumos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gastos.slice(0, 5).map(gasto => {
            const tipoInsumo = getTipoInsumo(gasto.tipo_insumo_id);
            return <div key={gasto.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{tipoInsumo?.nome || 'Insumo não encontrado'}</h4>
                        {tipoInsumo && <Badge variant="secondary" className="text-xs">
                            {tipoInsumo.categoria}
                          </Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{gasto.quantidade} {tipoInsumo?.unidade_medida}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(gasto.data_gasto), 'dd/MM/yyyy', {
                      locale: ptBR
                    })}
                        </span>
                        {gasto.fornecedor && <span>• {gasto.fornecedor}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {gasto.valor_total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        R$ {gasto.valor_unitario.toFixed(2)} / {tipoInsumo?.unidade_medida}
                      </p>
                    </div>
                  </div>;
          })}
              {gastos.length > 5 && <p className="text-center text-sm text-muted-foreground">
                  e mais {gastos.length - 5} gastos registrados...
                </p>}
            </div>
          </CardContent>
        </Card>}

      {/* Últimos Pagamentos */}
      {pagamentos && pagamentos.length > 0 && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Últimos Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pagamentos.slice(0, 5).map(pagamento => <div key={pagamento.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {pagamento.tipo_pessoa === 'DRAGADOR' ? 'Dragador' : 'Ajudante'}
                      </h4>
                      <Badge variant={pagamento.tipo_pagamento === 'ADIANTAMENTO' ? 'secondary' : 'default'}>
                        {pagamento.tipo_pagamento === 'ADIANTAMENTO' ? 'Adiantamento' : 'Pagamento Final'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', {
                    locale: ptBR
                  })}
                      </span>
                      {pagamento.observacoes && <span>• {pagamento.observacoes}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {pagamento.valor.toFixed(2)}</p>
                  </div>
                </div>)}
              {pagamentos.length > 5 && <p className="text-center text-sm text-muted-foreground">
                  e mais {pagamentos.length - 5} pagamentos registrados...
                </p>}
            </div>
          </CardContent>
        </Card>}
    </div>;
};