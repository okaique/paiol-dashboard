
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRelatorioVolumesPorPeriodo } from '@/hooks/useRelatorios';
import { usePaiols } from '@/hooks/usePaiols';
import { useCiclosPaiol } from '@/hooks/useCiclosPaiol';
import { FileBarChart, Download, Filter, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const RelatoriosVolumesPorPeriodo = () => {
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [selectedPaiol, setSelectedPaiol] = useState<string>('todos');
  const [selectedCiclo, setSelectedCiclo] = useState<string>('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPaiols, setExpandedPaiols] = useState<Set<string>>(new Set());
  
  const { data: paiols } = usePaiols();
  const { data: ciclos } = useCiclosPaiol(selectedPaiol !== 'todos' ? selectedPaiol : undefined);
  
  const filtros = {
    paiolId: selectedPaiol !== 'todos' ? selectedPaiol : undefined,
    ciclo: selectedCiclo !== 'todos' ? parseInt(selectedCiclo) : undefined,
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined,
  };
  
  const { data: volumes, isLoading, refetch } = useRelatorioVolumesPorPeriodo(filtros);

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

  const formatarDataHora = (data: string) => {
    try {
      return format(new Date(data), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return data;
    }
  };

  const handleExportCSV = () => {
    if (!volumes || volumes.length === 0) return;

    const csvLines = ['Paiol,Volume Cubado (m³),Volume Retirado (m³),Volume Disponível (m³),Número Retiradas'];
    
    volumes.forEach(volume => {
      csvLines.push(`"${volume.paiol_nome}",${volume.volume_total_cubado.toFixed(2)},${volume.volume_total_retirado.toFixed(2)},${volume.volume_disponivel.toFixed(2)},${volume.numero_retiradas}`);
      
      // Adicionar detalhes das retiradas
      if (volume.retiradas_detalhadas.length > 0) {
        csvLines.push('Data,Cliente,Volume,Valor Unit.,Valor Total,Status,Motorista,Placa');
        volume.retiradas_detalhadas.forEach(retirada => {
          csvLines.push(`"${formatarDataHora(retirada.data_retirada)}","${retirada.cliente_nome}",${retirada.volume_retirado.toFixed(2)},${retirada.valor_unitario.toFixed(2)},${retirada.valor_total.toFixed(2)},"${retirada.status_pagamento}","${retirada.motorista_nome || ''}","${retirada.placa_informada || ''}"`);
        });
        csvLines.push(''); // Linha em branco para separar paióis
      }
    });

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_volumes_detalhado_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleGerarRelatorio = () => {
    refetch();
  };

  const togglePaiolExpansion = (paiolId: string) => {
    const newExpanded = new Set(expandedPaiols);
    if (newExpanded.has(paiolId)) {
      newExpanded.delete(paiolId);
    } else {
      newExpanded.add(paiolId);
    }
    setExpandedPaiols(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          Relatório de Volumes por Período
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
              <Button onClick={handleGerarRelatorio} variant="outline">
                Atualizar
              </Button>
              <Button onClick={handleExportCSV} variant="outline" disabled={!volumes || volumes.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        ) : volumes && volumes.length > 0 ? (
          <>
            <div className="rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paiol</TableHead>
                    <TableHead className="text-right">Volume Cubado (m³)</TableHead>
                    <TableHead className="text-right">Volume Retirado (m³)</TableHead>
                    <TableHead className="text-right">Volume Disponível (m³)</TableHead>
                    <TableHead className="text-right">Nº Retiradas</TableHead>
                    <TableHead className="text-center">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volumes.map((volume) => (
                    <>
                      <TableRow key={volume.paiol_id}>
                        <TableCell className="font-medium">{volume.paiol_nome}</TableCell>
                        <TableCell className="text-right">
                          {volume.volume_total_cubado.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {volume.volume_total_retirado.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={volume.volume_disponivel >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {volume.volume_disponivel.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {volume.numero_retiradas}
                        </TableCell>
                        <TableCell className="text-center">
                          {volume.retiradas_detalhadas.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePaiolExpansion(volume.paiol_id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      
                      {/* Retiradas detalhadas */}
                      {expandedPaiols.has(volume.paiol_id) && volume.retiradas_detalhadas.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/50 p-0">
                            <div className="p-4">
                              <h4 className="font-semibold mb-3">Retiradas Detalhadas - {volume.paiol_nome}</h4>
                              <div className="rounded-md border">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Data/Hora</TableHead>
                                      <TableHead>Cliente</TableHead>
                                      <TableHead className="text-right">Volume (m³)</TableHead>
                                      <TableHead className="text-right">Valor Unit.</TableHead>
                                      <TableHead className="text-right">Valor Total</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Motorista</TableHead>
                                      <TableHead>Placa</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {volume.retiradas_detalhadas.map((retirada) => (
                                      <TableRow key={retirada.id}>
                                        <TableCell className="text-sm">
                                          {formatarDataHora(retirada.data_retirada)}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                          {retirada.cliente_nome}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                          {retirada.volume_retirado.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                          R$ {retirada.valor_unitario.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                          R$ {retirada.valor_total.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          <span className={`px-2 py-1 rounded text-xs ${
                                            retirada.status_pagamento === 'PAGO' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {retirada.status_pagamento === 'PAGO' ? 'Pago' : 'Não Pago'}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {retirada.motorista_nome || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {retirada.placa_informada || '-'}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              
                              {/* Totais das retiradas */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-3">
                                    <div className="text-lg font-bold text-blue-600">
                                      {volume.retiradas_detalhadas.reduce((sum, r) => sum + r.volume_retirado, 0).toFixed(2)} m³
                                    </div>
                                    <div className="text-sm text-muted-foreground">Volume Total Retirado</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-3">
                                    <div className="text-lg font-bold text-green-600">
                                      R$ {volume.retiradas_detalhadas.reduce((sum, r) => sum + r.valor_total, 0).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Valor Total</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-3">
                                    <div className="text-lg font-bold text-orange-600">
                                      {volume.retiradas_detalhadas.filter(r => r.status_pagamento === 'PAGO').length}/{volume.retiradas_detalhadas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Retiradas Pagas</div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {volumes.reduce((sum, v) => sum + v.volume_total_cubado, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cubado (m³)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {volumes.reduce((sum, v) => sum + v.volume_total_retirado, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Retirado (m³)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {volumes.reduce((sum, v) => sum + v.volume_disponivel, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Disponível (m³)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {volumes.reduce((sum, v) => sum + v.numero_retiradas, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Retiradas</div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : hasActiveFilters ? (
          <div className="text-center py-8 text-muted-foreground mt-6">
            Nenhum dado de volume encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground mt-6">
            Configure os filtros para gerar o relatório.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
