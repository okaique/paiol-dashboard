import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useManutencoes } from '@/hooks/useManutencoes';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useEmpresasMetanicas } from '@/hooks/useEmpresasMetanicas';
import { useTiposManutencao } from '@/hooks/useTiposManutencao';
import { Wrench, DollarSign, FileBarChart, Filter, Download } from 'lucide-react';
import type { Manutencao } from '@/types/database';

interface RelatorioManutencaoFilters {
  equipamentoId: string;
  empresaId: string;
  tipoId: string;
  dataInicio: string;
  dataFim: string;
}

export const RelatorioManutencoes = () => {
  const [filters, setFilters] = useState<RelatorioManutencaoFilters>({
    equipamentoId: 'todos',
    empresaId: 'todos',
    tipoId: 'todos',
    dataInicio: '',
    dataFim: '',
  });

  const { data: manutencoes = [], isLoading } = useManutencoes();
  const { data: equipamentos = [] } = useEquipamentos();
  const { data: empresas = [] } = useEmpresasMetanicas();
  const { data: tipos = [] } = useTiposManutencao();

  // Filtrar dados baseado nos filtros aplicados
  const dadosFiltrados = useMemo(() => {
    return manutencoes.filter((manutencao) => {
      // Filtro por equipamento
      if (filters.equipamentoId !== 'todos' && manutencao.equipamento_id !== filters.equipamentoId) {
        return false;
      }

      // Filtro por empresa
      if (filters.empresaId !== 'todos' && manutencao.empresa_id !== filters.empresaId) {
        return false;
      }

      // Filtro por tipo
      if (filters.tipoId !== 'todos' && manutencao.tipo_id !== filters.tipoId) {
        return false;
      }

      // Filtro por data início
      if (filters.dataInicio) {
        if (new Date(manutencao.data) < new Date(filters.dataInicio)) {
          return false;
        }
      }

      // Filtro por data fim
      if (filters.dataFim) {
        if (new Date(manutencao.data) > new Date(filters.dataFim + 'T23:59:59')) {
          return false;
        }
      }

      return true;
    });
  }, [manutencoes, filters]);

  // Cálculos de totalizações
  const totalizacoes = useMemo(() => {
    const totalGeral = dadosFiltrados.reduce((sum, manutencao) => sum + manutencao.valor, 0);
    
    const totalPorEquipamento = dadosFiltrados.reduce((acc, manutencao) => {
      const equipamentoNome = (manutencao as any).equipamento?.modelo || 'Não informado';
      acc[equipamentoNome] = (acc[equipamentoNome] || 0) + manutencao.valor;
      return acc;
    }, {} as Record<string, number>);

    const totalPorEmpresa = dadosFiltrados.reduce((acc, manutencao) => {
      const empresaNome = (manutencao as any).empresa?.nome || 'Não informado';
      acc[empresaNome] = (acc[empresaNome] || 0) + manutencao.valor;
      return acc;
    }, {} as Record<string, number>);

    const totalPorTipo = dadosFiltrados.reduce((acc, manutencao) => {
      const tipoNome = (manutencao as any).tipo?.nome || 'Não informado';
      acc[tipoNome] = (acc[tipoNome] || 0) + manutencao.valor;
      return acc;
    }, {} as Record<string, number>);

    const totalPorMes = dadosFiltrados.reduce((acc, manutencao) => {
      const mesAno = new Date(manutencao.data).toLocaleDateString('pt-BR', { 
        month: '2-digit', 
        year: 'numeric' 
      });
      acc[mesAno] = (acc[mesAno] || 0) + manutencao.valor;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGeral,
      totalPorEquipamento,
      totalPorEmpresa,
      totalPorTipo,
      totalPorMes,
      mediaManutencao: dadosFiltrados.length > 0 ? totalGeral / dadosFiltrados.length : 0,
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
      equipamentoId: 'todos',
      empresaId: 'todos',
      tipoId: 'todos',
      dataInicio: '',
      dataFim: '',
    });
  };

  const hasFilters = filters.equipamentoId !== 'todos' || filters.empresaId !== 'todos' || filters.tipoId !== 'todos' || filters.dataInicio || filters.dataFim;

  const handleExportCSV = () => {
    if (dadosFiltrados.length === 0) return;

    const csvContent = [
      'Data,Equipamento,Empresa,Tipo,Valor,Responsável,Observações',
      ...dadosFiltrados.map(manutencao => 
        `"${formatDate(manutencao.data)}","${(manutencao as any).equipamento?.modelo || '-'}","${(manutencao as any).empresa?.nome || '-'}","${(manutencao as any).tipo?.nome || '-'}","${manutencao.valor.toFixed(2)}","${manutencao.responsavel || '-'}","${manutencao.observacoes || '-'}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_manutencoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <SelectItem value="todos">Todos os equipamentos</SelectItem>
                  {equipamentos.map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.id}>
                      {equipamento.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select
                value={filters.empresaId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, empresaId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as empresas</SelectItem>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={filters.tipoId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, tipoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tipos.map((tipo) => (
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

          <div className="flex justify-between items-center mt-4">
            {hasFilters && (
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            )}
            <Button variant="outline" onClick={handleExportCSV} disabled={dadosFiltrados.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
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
                <p className="text-sm text-muted-foreground">Total de Manutenções</p>
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
                <p className="text-sm text-muted-foreground">Valor Médio</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalizacoes.mediaManutencao)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-purple-600" />
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

      {/* Total por Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Total por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(totalizacoes.totalPorEmpresa).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum dado encontrado com os filtros aplicados
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(totalizacoes.totalPorEmpresa).map(([empresa, total]) => (
                <div key={empresa} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{empresa}</span>
                  <Badge variant="outline">{formatCurrency(total)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhamento das Manutenções */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento das Manutenções</CardTitle>
        </CardHeader>
        <CardContent>
          {dadosFiltrados.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma manutenção encontrada com os filtros aplicados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.map((manutencao) => (
                  <TableRow key={manutencao.id}>
                    <TableCell>{formatDate(manutencao.data)}</TableCell>
                    <TableCell>{(manutencao as any).equipamento?.modelo || '-'}</TableCell>
                    <TableCell>{(manutencao as any).empresa?.nome || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(manutencao as any).tipo?.nome || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(manutencao.valor)}
                    </TableCell>
                    <TableCell>{manutencao.responsavel || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {manutencao.observacoes || '-'}
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
