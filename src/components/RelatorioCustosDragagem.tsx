
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, DollarSign, Package, Users, TrendingUp, Download, Calculator } from 'lucide-react';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
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

interface RelatorioCustosDragagemProps {
  dragagem: DragagemDetalhada;
}

export const RelatorioCustosDragagem = ({ dragagem }: RelatorioCustosDragagemProps) => {
  const { data: gastos, isLoading: loadingGastos } = useGastosInsumos(dragagem.id);
  const { data: pagamentos, isLoading: loadingPagamentos } = usePagamentosPessoal(dragagem.id);
  const { data: tiposInsumos } = useTiposInsumos();

  if (loadingGastos || loadingPagamentos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório de Custos da Dragagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando relatório...</p>
        </CardContent>
      </Card>
    );
  }

  // Cálculos principais
  const totalGastosInsumos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;
  const totalPagamentos = pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  const totalGeral = totalGastosInsumos + totalPagamentos;

  // Breakdown por categoria de insumos
  const gastosPorCategoria: Record<string, { total: number; quantidade: number; itens: any[] }> = {};
  gastos?.forEach(gasto => {
    const tipoInsumo = tiposInsumos?.find(tipo => tipo.id === gasto.tipo_insumo_id);
    const categoria = tipoInsumo?.categoria || 'OUTROS';
    
    if (!gastosPorCategoria[categoria]) {
      gastosPorCategoria[categoria] = { total: 0, quantidade: 0, itens: [] };
    }
    
    gastosPorCategoria[categoria].total += gasto.valor_total;
    gastosPorCategoria[categoria].quantidade += 1;
    gastosPorCategoria[categoria].itens.push({
      ...gasto,
      tipoInsumo
    });
  });

  // Separar pagamentos por pessoa e tipo
  const pagamentosPorPessoa: Record<string, { nome: string; tipo: string; adiantamentos: number; pagamentosFinais: number; total: number }> = {};
  
  pagamentos?.forEach(pagamento => {
    const pessoaKey = `${pagamento.pessoa_id}-${pagamento.tipo_pessoa}`;
    const nome = pagamento.tipo_pessoa === 'DRAGADOR' ? dragagem.dragador?.nome : dragagem.ajudante?.nome;
    
    if (!pagamentosPorPessoa[pessoaKey]) {
      pagamentosPorPessoa[pessoaKey] = {
        nome: nome || 'Nome não encontrado',
        tipo: pagamento.tipo_pessoa,
        adiantamentos: 0,
        pagamentosFinais: 0,
        total: 0
      };
    }
    
    if (pagamento.tipo_pagamento === 'ADIANTAMENTO') {
      pagamentosPorPessoa[pessoaKey].adiantamentos += pagamento.valor;
    } else {
      pagamentosPorPessoa[pessoaKey].pagamentosFinais += pagamento.valor;
    }
    
    pagamentosPorPessoa[pessoaKey].total += pagamento.valor;
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
    // Implementação futura para exportar relatório
    console.log('Exportar relatório - função a ser implementada');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório Final de Custos da Dragagem
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {dragagem.paiol?.nome} • {format(new Date(dragagem.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                {dragagem.data_fim && ` até ${format(new Date(dragagem.data_fim), 'dd/MM/yyyy', { locale: ptBR })}`}
              </p>
            </div>
            <Button onClick={handleExportReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
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
              <p className="text-sm text-muted-foreground">Insumos</p>
              <p className="text-xl font-bold text-blue-600">R$ {totalGastosInsumos.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Pessoal</p>
              <p className="text-xl font-bold text-green-600">R$ {totalPagamentos.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-muted-foreground">Dias de Operação</p>
              <p className="text-xl font-bold text-gray-600">
                {dragagem.data_fim 
                  ? Math.ceil((new Date(dragagem.data_fim).getTime() - new Date(dragagem.data_inicio).getTime()) / (1000 * 3600 * 24))
                  : '---'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown por Categoria de Insumos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Breakdown por Categoria de Insumos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(gastosPorCategoria)
                .sort(([,a], [,b]) => b.total - a.total)
                .map(([categoria, dados]) => (
                  <TableRow key={categoria}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{getCategoriaLabel(categoria)}</Badge>
                      </div>
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
              {Object.keys(gastosPorCategoria).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum gasto com insumos registrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo de Pagamentos por Pessoa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumo de Pagamentos por Pessoa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pessoa</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-right">Adiantamentos</TableHead>
                <TableHead className="text-right">Pagamentos Finais</TableHead>
                <TableHead className="text-right">Total Pago</TableHead>
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
                  <TableCell className="text-right">
                    R$ {dados.adiantamentos.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {dados.pagamentosFinais.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {dados.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {Object.keys(pagamentosPorPessoa).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum pagamento registrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estatísticas Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas da Dragagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">DISTRIBUIÇÃO DE CUSTOS</h4>
              <div className="space-y-1">
                {totalGeral > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Insumos:</span>
                      <span>{((totalGastosInsumos / totalGeral) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pessoal:</span>
                      <span>{((totalPagamentos / totalGeral) * 100).toFixed(1)}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">QUANTIDADE DE REGISTROS</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Gastos com Insumos:</span>
                  <span>{gastos?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pagamentos:</span>
                  <span>{pagamentos?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">CUSTOS MÉDIOS</h4>
              <div className="space-y-1">
                {dragagem.data_fim && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Por Dia:</span>
                      <span>
                        R$ {(totalGeral / Math.ceil((new Date(dragagem.data_fim).getTime() - new Date(dragagem.data_inicio).getTime()) / (1000 * 3600 * 24))).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                {gastos && gastos.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Por Insumo:</span>
                    <span>R$ {(totalGastosInsumos / gastos.length).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
