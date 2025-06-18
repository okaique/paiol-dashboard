
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRelatorioCustosPorPaiol } from '@/hooks/useRelatorios';
import { usePaiols } from '@/hooks/usePaiols';
import { useCiclosPaiol } from '@/hooks/useCiclosPaiol';
import { FileText, Download, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RelatoriosCustosPorPaiol = () => {
  const [selectedPaiol, setSelectedPaiol] = useState<string>('todos');
  const [selectedCiclo, setSelectedCiclo] = useState<string>('todos');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: paiols } = usePaiols();
  const { data: ciclos } = useCiclosPaiol(selectedPaiol !== 'todos' ? selectedPaiol : undefined);
  
  const filtros = {
    paiolId: selectedPaiol !== 'todos' ? selectedPaiol : undefined,
    ciclo: selectedCiclo !== 'todos' ? parseInt(selectedCiclo) : undefined,
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined,
  };
  
  const { data: custos, isLoading, refetch } = useRelatorioCustosPorPaiol(filtros);

  const handleClearFilters = () => {
    setSelectedPaiol('todos');
    setSelectedCiclo('todos');
    setDataInicio('');
    setDataFim('');
  };

  const hasActiveFilters = selectedPaiol !== 'todos' || selectedCiclo !== 'todos' || dataInicio || dataFim;

  const formatarDataCiclo = (data: string) => {
    try {
      return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return data;
    }
  };

  const handleExportCSV = () => {
    if (!custos || custos.length === 0) return;

    const csvContent = [
      'Paiol,Total Gastos Insumos,Total Pagamentos Pessoal,Total Geral',
      ...custos.map(custo => 
        `"${custo.paiol_nome}",${custo.total_gastos_insumos.toFixed(2)},${custo.total_pagamentos_pessoal.toFixed(2)},${custo.total_geral.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_custos_por_paiol_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatório de Custos por Paiol
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controles principais */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="paiol-select">Paiol</Label>
              <Select value={selectedPaiol} onValueChange={(value) => {
                setSelectedPaiol(value);
                setSelectedCiclo('todos'); // Limpar ciclo ao trocar paiol
              }}>
                <SelectTrigger id="paiol-select">
                  <SelectValue placeholder="Selecione um paiol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os paióis</SelectItem>
                  {paiols?.map((paiol) => (
                    <SelectItem key={paiol.id} value={paiol.id}>
                      {paiol.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowFilters(!showFilters)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button onClick={() => refetch()} variant="outline">
                Atualizar
              </Button>
              <Button onClick={handleExportCSV} variant="outline" disabled={!custos || custos.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Filtro por Ciclo */}
                  <div>
                    <Label htmlFor="ciclo-select">Ciclo</Label>
                    <Select 
                      value={selectedCiclo} 
                      onValueChange={setSelectedCiclo}
                      disabled={selectedPaiol === 'todos'}
                    >
                      <SelectTrigger id="ciclo-select">
                        <SelectValue placeholder={selectedPaiol !== 'todos' ? "Selecione um ciclo" : "Primeiro selecione um paiol"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os ciclos</SelectItem>
                        {ciclos?.map((ciclo) => (
                          <SelectItem key={ciclo.ciclo} value={ciclo.ciclo.toString()}>
                            Ciclo {ciclo.ciclo} ({formatarDataCiclo(ciclo.dataInicio)} - {ciclo.dataFim ? formatarDataCiclo(ciclo.dataFim) : 'Atual'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro por Data Início */}
                  <div>
                    <Label htmlFor="data-inicio">Data Início</Label>
                    <Input
                      id="data-inicio"
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>

                  {/* Filtro por Data Fim */}
                  <div>
                    <Label htmlFor="data-fim">Data Fim</Label>
                    <Input
                      id="data-fim"
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>

                  {/* Limpar filtros */}
                  <div className="flex items-end">
                    <Button 
                      onClick={handleClearFilters} 
                      variant="outline" 
                      className="w-full"
                      disabled={!hasActiveFilters}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpar
                    </Button>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">Filtros ativos:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPaiol !== 'todos' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Paiol: {paiols?.find(p => p.id === selectedPaiol)?.nome}
                        </span>
                      )}
                      {selectedCiclo !== 'todos' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Ciclo: {selectedCiclo}
                        </span>
                      )}
                      {dataInicio && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          De: {formatarDataCiclo(dataInicio)}
                        </span>
                      )}
                      {dataFim && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Até: {formatarDataCiclo(dataFim)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8 mt-6">
            <div className="text-muted-foreground">Carregando relatório...</div>
          </div>
        ) : custos && custos.length > 0 ? (
          <>
            <div className="rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paiol</TableHead>
                    <TableHead className="text-right">Gastos Insumos</TableHead>
                    <TableHead className="text-right">Pagamentos Pessoal</TableHead>
                    <TableHead className="text-right">Total Geral</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {custos.map((custo) => (
                    <TableRow key={custo.paiol_id}>
                      <TableCell className="font-medium">{custo.paiol_nome}</TableCell>
                      <TableCell className="text-right">
                        R$ {custo.total_gastos_insumos.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {custo.total_pagamentos_pessoal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {custo.total_geral.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {custos.reduce((sum, c) => sum + c.total_gastos_insumos, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Gastos Insumos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {custos.reduce((sum, c) => sum + c.total_pagamentos_pessoal, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Pagamentos Pessoal</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {custos.reduce((sum, c) => sum + c.total_geral, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Geral</div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground mt-6">
            {hasActiveFilters 
              ? "Nenhum dado de custo encontrado para os filtros selecionados."
              : "Nenhum dado de custo encontrado."
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};
