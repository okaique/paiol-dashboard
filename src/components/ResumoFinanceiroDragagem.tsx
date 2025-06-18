import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
interface ResumoFinanceiroDragagemProps {
  dragagemId: string;
}
export const ResumoFinanceiroDragagem = ({
  dragagemId
}: ResumoFinanceiroDragagemProps) => {
  const {
    data: gastos,
    isLoading: loadingGastos
  } = useGastosInsumos(dragagemId);
  const {
    data: pagamentos,
    isLoading: loadingPagamentos
  } = usePagamentosPessoal(dragagemId);
  if (loadingGastos || loadingPagamentos) {
    return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </CardContent>
      </Card>;
  }
  const totalGastosInsumos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;
  const totalPagamentos = pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  const totalGeral = totalGastosInsumos + totalPagamentos;

  // Agrupar gastos por categoria
  const gastosPorCategoria: Record<string, number> = {};
  gastos?.forEach(gasto => {
    // Note: Seria necessário fazer join com tipos_insumos para pegar a categoria
    // Por simplicidade, vou deixar como "Insumos" por enquanto
    const categoria = 'Insumos';
    gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + gasto.valor_total;
  });

  // Separar pagamentos por tipo
  const adiantamentos = pagamentos?.filter(p => p.tipo_pagamento === 'ADIANTAMENTO') || [];
  const pagamentosFinais = pagamentos?.filter(p => p.tipo_pagamento === 'PAGAMENTO_FINAL') || [];
  const totalAdiantamentos = adiantamentos.reduce((total, p) => total + p.valor, 0);
  const totalPagamentosFinais = pagamentosFinais.reduce((total, p) => total + p.valor, 0);
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Resumo Financeiro da Dragagem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Geral */}
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-semibold text-muted-foreground">Total Investido</h3>
          <p className="text-3xl font-bold text-primary">R$ {totalGeral.toFixed(2)}</p>
        </div>

        {/* Breakdown por categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gastos com Insumos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">Gastos com Insumos</h4>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="font-medium">R$ {totalGastosInsumos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Registros:</span>
                <Badge variant="secondary">{gastos?.length || 0}</Badge>
              </div>
            </div>
          </div>

          {/* Pagamentos de Pessoal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-medium">Pagamentos</h4>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="font-medium">R$ {totalPagamentos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Adiantamentos:</span>
                <span className="text-sm">R$ {totalAdiantamentos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pagamentos Finais:</span>
                <span className="text-sm">R$ {totalPagamentosFinais.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Gastos Insumos</p>
              <p className="text-lg font-semibold">
                {totalGeral > 0 ? (totalGastosInsumos / totalGeral * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pagamentos</p>
              <p className="text-lg font-semibold">
                {totalGeral > 0 ? (totalPagamentos / totalGeral * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registros</p>
              <p className="text-lg font-semibold">
                {(gastos?.length || 0) + (pagamentos?.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};