
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { FileText, DollarSign, Package, Users, Calculator, BarChart3, Download, Calendar } from 'lucide-react';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Dragagem } from '@/types/database';

interface DragagemDetalhada extends Dragagem {
  dragador?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  ajudante?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  paiol?: {
    id: string;
    nome: string;
    status: string;
  };
}

interface RelatorioFinalDragagemProps {
  dragagem: DragagemDetalhada;
}

export const RelatorioFinalDragagem = ({ dragagem }: RelatorioFinalDragagemProps) => {
  const { data: gastos, isLoading: loadingGastos } = useGastosInsumos(dragagem.id);
  const { data: pagamentos, isLoading: loadingPagamentos } = usePagamentosPessoal(dragagem.id);
  const { data: cubagem, isLoading: loadingCubagem } = useCubagemPorDragagem(dragagem.id);
  const { data: tiposInsumos } = useTiposInsumos();

  if (loadingGastos || loadingPagamentos || loadingCubagem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório Final da Dragagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando relatório final...</p>
        </CardContent>
      </Card>
    );
  }

  // Cálculos principais
  const totalGastosInsumos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;
  const totalPagamentos = pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  const totalGeral = totalGastosInsumos + totalPagamentos;

  // Calcular dias de operação
  const diasOperacao = dragagem.data_fim 
    ? Math.ceil((new Date(dragagem.data_fim).getTime() - new Date(dragagem.data_inicio).getTime()) / (1000 * 3600 * 24))
    : 0;

  // Breakdown por categoria de insumos
  const gastosPorCategoria: Record<string, { total: number; quantidade: number }> = {};
  gastos?.forEach(gasto => {
    const tipoInsumo = tiposInsumos?.find(tipo => tipo.id === gasto.tipo_insumo_id);
    const categoria = tipoInsumo?.categoria || 'OUTROS';
    
    if (!gastosPorCategoria[categoria]) {
      gastosPorCategoria[categoria] = { total: 0, quantidade: 0 };
    }
    
    gastosPorCategoria[categoria].total += gasto.valor_total;
    gastosPorCategoria[categoria].quantidade += 1;
  });

  // Pagamentos por pessoa
  const pagamentosPorPessoa: Record<string, { nome: string; tipo: string; total: number; adiantamentos: number; pagamentosFinais: number }> = {};
  
  pagamentos?.forEach(pagamento => {
    const pessoaKey = `${pagamento.pessoa_id}-${pagamento.tipo_pessoa}`;
    const nome = pagamento.tipo_pessoa === 'DRAGADOR' ? dragagem.dragador?.nome : dragagem.ajudante?.nome;
    
    if (!pagamentosPorPessoa[pessoaKey]) {
      pagamentosPorPessoa[pessoaKey] = {
        nome: nome || 'Nome não encontrado',
        tipo: pagamento.tipo_pessoa,
        total: 0,
        adiantamentos: 0,
        pagamentosFinais: 0
      };
    }
    
    pagamentosPorPessoa[pessoaKey].total += pagamento.valor;
    
    if (pagamento.tipo_pagamento === 'ADIANTAMENTO') {
      pagamentosPorPessoa[pessoaKey].adiantamentos += pagamento.valor;
    } else {
      pagamentosPorPessoa[pessoaKey].pagamentosFinais += pagamento.valor;
    }
  });

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'COMBUSTIVEL': 'Combustíveis',
      'OLEO': 'Óleos', 
      'FILTRO': 'Filtros',
      'LUBRIFICANTE': 'Lubrificantes',
      'MANUTENCAO': 'Manutenção',
      'OUTROS': 'Outros'
    };
    return labels[categoria] || categoria;
  };

  const handleExportReport = () => {
    console.log('Exportar relatório - funcionalidade a ser implementada no futuro');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatório Final da Dragagem
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {dragagem.paiol?.nome} • Ciclo finalizado em {dragagem.data_fim && format(new Date(dragagem.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <Button onClick={handleExportReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <Calculator className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="text-2xl font-bold text-primary">R$ {totalGeral.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">Volume Disponível</p>
              <p className="text-xl font-bold text-blue-600">
                {cubagem ? `${cubagem.volume_reduzido.toFixed(3)} m³` : 'N/A'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Custo por m³</p>
              <p className="text-xl font-bold text-green-600">
                {cubagem && cubagem.volume_reduzido > 0 
                  ? `R$ ${(totalGeral / cubagem.volume_reduzido).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-muted-foreground">Dias de Operação</p>
              <p className="text-xl font-bold text-orange-600">{diasOperacao}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Cubagem */}
      {cubagem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Volume Final Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-700 mb-2">Volume Normal</h4>
                <p className="text-2xl font-bold text-blue-800">{cubagem.volume_normal.toFixed(3)} m³</p>
                <p className="text-xs text-blue-600">Volume bruto calculado</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-700 mb-2">Volume Reduzido</h4>
                <p className="text-2xl font-bold text-green-800">{cubagem.volume_reduzido.toFixed(3)} m³</p>
                <p className="text-xs text-green-600">Volume líquido (85%)</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-700 mb-2">Perda Estimada</h4>
                <p className="text-2xl font-bold text-orange-800">
                  {(cubagem.volume_normal - cubagem.volume_reduzido).toFixed(3)} m³
                </p>
                <p className="text-xs text-orange-600">15% de perda padrão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consolidação de Custos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Consolidação de Custos - Insumos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(gastosPorCategoria)
                  .sort(([,a], [,b]) => b.total - a.total)
                  .map(([categoria, dados]) => (
                    <TableRow key={categoria}>
                      <TableCell>
                        <Badge variant="secondary">{getCategoriaLabel(categoria)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{dados.quantidade}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {dados.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {totalGastosInsumos > 0 ? ((dados.total / totalGastosInsumos) * 100).toFixed(1) : '0'}%
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="border-t-2">
                  <TableCell className="font-semibold">TOTAL INSUMOS</TableCell>
                  <TableCell className="text-center font-semibold">
                    {Object.values(gastosPorCategoria).reduce((sum, cat) => sum + cat.quantidade, 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold">R$ {totalGastosInsumos.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Somatória de Pagamentos por Pessoa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Somatória Final - Pagamentos por Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Adiantamentos</TableHead>
                  <TableHead className="text-right">Pagtos Finais</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(pagamentosPorPessoa).map(([key, dados]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{dados.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {dados.tipo === 'DRAGADOR' ? 'Dragador' : 'Ajudante'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">R$ {dados.adiantamentos.toFixed(2)}</TableCell>
                    <TableCell className="text-right">R$ {dados.pagamentosFinais.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {dados.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-semibold">TOTAL PAGAMENTOS</TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {Object.values(pagamentosPorPessoa).reduce((sum, p) => sum + p.adiantamentos, 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {Object.values(pagamentosPorPessoa).reduce((sum, p) => sum + p.pagamentosFinais, 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">R$ {totalPagamentos.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Final */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Final do Investimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span>Total Gastos com Insumos:</span>
              <span className="font-semibold">R$ {totalGastosInsumos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span>Total Pagamentos de Pessoal:</span>
              <span className="font-semibold">R$ {totalPagamentos.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-2xl font-bold text-primary">
              <span>INVESTIMENTO TOTAL:</span>
              <span>R$ {totalGeral.toFixed(2)}</span>
            </div>
            
            {cubagem && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Custo por m³</p>
                    <p className="text-lg font-semibold">
                      R$ {(totalGeral / cubagem.volume_reduzido).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Custo por dia</p>
                    <p className="text-lg font-semibold">
                      R$ {diasOperacao > 0 ? (totalGeral / diasOperacao).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Volume disponível</p>
                    <p className="text-lg font-semibold text-green-600">
                      {cubagem.volume_reduzido.toFixed(3)} m³
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
