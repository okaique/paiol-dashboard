
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGastosGerais } from '@/hooks/useGastosGerais';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useTiposGastos } from '@/hooks/useTiposGastos';
import { Calendar, DollarSign, FileBarChart, Filter, Download } from 'lucide-react';
import type { GastoGeral } from '@/types/database';

interface RelatorioFilters {
  equipamentoId: string;
  tipoId: string;
  dataInicio: string;
  dataFim: string;
}

export const RelatorioGastosGerais = () => {
  const [filters, setFilters] = useState<RelatorioFilters>({
    equipamentoId: '',
    tipoId: '',
    dataInicio: '',
    dataFim: '',
  });

  const { data: gastosGerais = [], isLoading } = useGastosGerais();
  const { data: equipamentos = [] } = useEquipamentos();
  const { data: tiposGastos = [] } = useTiposGastos();

  // Filtrar dados baseado nos filtros aplicados
  const dadosFiltrados = useMemo(() => {
    return gastosGerais.filter((gasto) => {
      // Filtro por equipamento
      if (filters.equipamentoId && gasto.equipamento_id !== filters.equipamentoId) {
        return false;
      }

      // Filtro por tipo
      if (filters.tipoId && gasto.tipo_id !== filters.tipoId) {
        return false;
      }

      // Filtro por data início
      if (filters.dataInicio) {
        if (new Date(gasto.data) < new Date(filters.dataInicio)) {
          return false;
        }
      }

      // Filtro por data fim
      if (filters.dataFim) {
        if (new Date(gasto.data) > new Date(filters.dataFim + 'T23:59:59')) {
          return false;
        }
      }

      return true;
    });
  }, [gastosGerais, filters]);

  // Cálculos de totalizações
  const totalizacoes = useMemo(() => {
    const totalGeral = dadosFiltrados.reduce((sum, gasto) => sum + gasto.valor, 0);
    const totalPorEquipamento = dadosFiltrados.reduce((acc, gasto) => {
      const equipamentoNome = (gasto as any).equipamento?.modelo || 'Não informado';
      acc[equipamentoNome] = (acc[equipamentoNome] || 0) + gasto.valor;
      return acc;
    }, {} as Record<string, number>);

    const totalPorTipo = dadosFiltrados.reduce((acc, gasto) => {
      const tipoNome = (gasto as any).tipo?.nome || 'Não informado';
      acc[tipoNome] = (acc[tipoNome] || 0) + gasto.valor;
      return acc;
    }, {} as Record<string, number>);

    const totalPorMes = dadosFiltrados.reduce((acc, gasto) => {
      const mesAno = new Date(gasto.data).toLocaleDateString('pt-BR', { 
        month: '2-digit', 
        year: 'numeric' 
      });
      acc[mesAno] = (acc[mesAno] || 0) + gasto.valor;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGeral,
      totalPorEquipamento,
      totalPorTipo,
      totalPorMes,
      mediaGasto: dadosFiltrados.length > 0 ? totalGeral / dadosFiltrados.length : 0,
      totalRegistros: dadosFiltrados.length,
    };
  }, [dadosFiltrados]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const limparFiltros = () => {
    setFilters({
      equipamentoId: '',
      tipoId: '',
      dataInicio: '',
      dataFim: '',
    });
  };

  const hasFilters = filters.equipamentoId || filters.tipoId || filters.dataInicio || filters.dataFim;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando relatório...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipamento">Equipamento</Label>
              <Select
                value={filters.equipamentoId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, equipamentoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os equipamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os equipamentos</SelectItem>
                  {equipamentos.map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.id}>
                      {equipamento.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Gasto</Label>
              <Select
                value={filters.tipoId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, tipoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposGastos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
              />
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4">
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Geral</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalizacoes.totalGeral)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Registros</p>
                <p className="text-lg font-semibold">{totalizacoes.totalRegistros}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Gasto Médio</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalizacoes.mediaGasto)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="text-lg font-semibold">
                  {hasFilters ? 'Filtrado' : 'Completo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total por Equipamento */}
      <Card>
        <CardHeader>
          <CardTitle>Total por Equipamento</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(totalizacoes.totalPorEquipamento).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum dado encontrado com os filtros aplicados
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(totalizacoes.totalPorEquipamento).map(([equipamento, total]) => (
                <div key={equipamento} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{equipamento}</span>
                  <Badge variant="outline">{formatCurrency(total)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Total por Tipo de Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(totalizacoes.totalPorTipo).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum dado encontrado com os filtros aplicados
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(totalizacoes.totalPorTipo).map(([tipo, total]) => (
                <div key={tipo} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{tipo}</span>
                  <Badge variant="outline">{formatCurrency(total)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhamento dos Gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento dos Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {dadosFiltrados.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum gasto encontrado com os filtros aplicados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.map((gasto) => (
                  <TableRow key={gasto.id}>
                    <TableCell>{formatDate(gasto.data)}</TableCell>
                    <TableCell>{(gasto as any).equipamento?.modelo || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(gasto as any).tipo?.nome || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(gasto.valor)}
                    </TableCell>
                    <TableCell>{gasto.responsavel || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {gasto.observacoes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
