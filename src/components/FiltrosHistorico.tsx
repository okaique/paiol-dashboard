
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, X, DollarSign, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FiltrosHistoricoProps {
  onFiltrosChange: (filtros: any) => void;
  filtrosAtivos: any;
}

const TIPOS_EVENTO = [
  { value: 'TRANSICAO', label: 'Mudanças de Status', color: 'bg-blue-100 text-blue-800' },
  { value: 'DRAGAGEM_INICIO', label: 'Início de Dragagem', color: 'bg-green-100 text-green-800' },
  { value: 'DRAGAGEM_FIM', label: 'Fim de Dragagem', color: 'bg-green-100 text-green-800' },
  { value: 'CUBAGEM', label: 'Registros de Cubagem', color: 'bg-purple-100 text-purple-800' },
  { value: 'RETIRADA', label: 'Retiradas', color: 'bg-orange-100 text-orange-800' },
  { value: 'PAGAMENTO', label: 'Pagamentos', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'GASTO_INSUMO', label: 'Gastos com Insumos', color: 'bg-red-100 text-red-800' },
];

const STATUS_OPTIONS = [
  { value: 'VAZIO', label: 'Vazio' },
  { value: 'DRAGANDO', label: 'Dragando' },
  { value: 'CHEIO', label: 'Cheio' },
  { value: 'RETIRANDO', label: 'Retirando' },
];

export const FiltrosHistorico = ({ onFiltrosChange, filtrosAtivos }: FiltrosHistoricoProps) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosLocais, setFiltrosLocais] = useState({
    dataInicio: filtrosAtivos?.dataInicio || '',
    dataFim: filtrosAtivos?.dataFim || '',
    tiposEvento: filtrosAtivos?.tiposEvento || [],
    statusAssociado: filtrosAtivos?.statusAssociado || 'TODOS',
    ordenacao: filtrosAtivos?.ordenacao || 'desc',
    comValor: filtrosAtivos?.comValor || false,
  });

  const handleTipoEventoChange = (tipo: string, checked: boolean) => {
    const novosTipos = checked
      ? [...filtrosLocais.tiposEvento, tipo]
      : filtrosLocais.tiposEvento.filter((t: string) => t !== tipo);

    setFiltrosLocais(prev => ({ ...prev, tiposEvento: novosTipos }));
  };

  const aplicarFiltros = () => {
    // Converter 'TODOS' para string vazia para manter compatibilidade
    const filtrosParaEnviar = {
      ...filtrosLocais,
      statusAssociado: filtrosLocais.statusAssociado === 'TODOS' ? '' : filtrosLocais.statusAssociado
    };
    onFiltrosChange(filtrosParaEnviar);
    setMostrarFiltros(false);
  };

  const limparFiltros = () => {
    const filtrosVazios = {
      dataInicio: '',
      dataFim: '',
      tiposEvento: [],
      statusAssociado: 'TODOS',
      ordenacao: 'desc',
      comValor: false,
    };
    setFiltrosLocais(filtrosVazios);
    // Converter 'TODOS' para string vazia para manter compatibilidade
    onFiltrosChange({
      ...filtrosVazios,
      statusAssociado: ''
    });
  };

  const temFiltrosAtivos = 
    filtrosAtivos?.dataInicio ||
    filtrosAtivos?.dataFim ||
    (filtrosAtivos?.statusAssociado && filtrosAtivos?.statusAssociado !== '') ||
    (filtrosAtivos?.tiposEvento && filtrosAtivos.tiposEvento.length > 0) ||
    filtrosAtivos?.comValor ||
    (filtrosAtivos?.ordenacao && filtrosAtivos.ordenacao !== 'desc');

  const contadorFiltros = 
    (filtrosAtivos?.dataInicio ? 1 : 0) +
    (filtrosAtivos?.dataFim ? 1 : 0) +
    (filtrosAtivos?.statusAssociado && filtrosAtivos?.statusAssociado !== '' ? 1 : 0) +
    (filtrosAtivos?.tiposEvento?.length || 0) +
    (filtrosAtivos?.comValor ? 1 : 0) +
    (filtrosAtivos?.ordenacao && filtrosAtivos.ordenacao !== 'desc' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Botão de controle e badges de filtros ativos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={mostrarFiltros ? "default" : "outline"}
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {contadorFiltros > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {contadorFiltros}
              </Badge>
            )}
          </Button>

          {temFiltrosAtivos && (
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Badges dos filtros ativos */}
        <div className="flex flex-wrap gap-1">
          {filtrosAtivos?.dataInicio && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Desde: {format(new Date(filtrosAtivos.dataInicio), 'dd/MM/yyyy', { locale: ptBR })}
            </Badge>
          )}
          {filtrosAtivos?.dataFim && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Até: {format(new Date(filtrosAtivos.dataFim), 'dd/MM/yyyy', { locale: ptBR })}
            </Badge>
          )}
          {filtrosAtivos?.statusAssociado && filtrosAtivos?.statusAssociado !== '' && (
            <Badge variant="outline" className="text-xs">
              Status: {STATUS_OPTIONS.find(s => s.value === filtrosAtivos.statusAssociado)?.label}
            </Badge>
          )}
          {filtrosAtivos?.ordenacao && filtrosAtivos.ordenacao !== 'desc' && (
            <Badge variant="outline" className="text-xs">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              {filtrosAtivos.ordenacao === 'asc' ? 'Mais antigos' : 'Mais recentes'}
            </Badge>
          )}
          {filtrosAtivos?.comValor && (
            <Badge variant="outline" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              Com valor
            </Badge>
          )}
          {filtrosAtivos?.tiposEvento?.map((tipo: string) => {
            const tipoInfo = TIPOS_EVENTO.find(t => t.value === tipo);
            return (
              <Badge key={tipo} variant="outline" className="text-xs">
                {tipoInfo?.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Painel de filtros */}
      {mostrarFiltros && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filtros do Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros de data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filtrosLocais.dataInicio}
                  onChange={(e) => setFiltrosLocais(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filtrosLocais.dataFim}
                  onChange={(e) => setFiltrosLocais(prev => ({ ...prev, dataFim: e.target.value }))}
                />
              </div>
            </div>

            {/* Status associado e ordenação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status Associado</Label>
                <Select
                  value={filtrosLocais.statusAssociado}
                  onValueChange={(value) => setFiltrosLocais(prev => ({ ...prev, statusAssociado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos os status</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ordenação</Label>
                <Select
                  value={filtrosLocais.ordenacao}
                  onValueChange={(value) => setFiltrosLocais(prev => ({ ...prev, ordenacao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Mais recentes primeiro</SelectItem>
                    <SelectItem value="asc">Mais antigos primeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipos de evento */}
            <div className="space-y-3">
              <Label>Tipos de Evento</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIPOS_EVENTO.map((tipo) => (
                  <div key={tipo.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={tipo.value}
                      checked={filtrosLocais.tiposEvento.includes(tipo.value)}
                      onCheckedChange={(checked) => handleTipoEventoChange(tipo.value, checked as boolean)}
                    />
                    <Label htmlFor={tipo.value} className="text-sm font-normal">
                      <Badge variant="outline" className={tipo.color}>
                        {tipo.label}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Outros filtros */}
            <div className="space-y-3">
              <Label>Filtros Adicionais</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comValor"
                  checked={filtrosLocais.comValor}
                  onCheckedChange={(checked) => setFiltrosLocais(prev => ({ ...prev, comValor: checked as boolean }))}
                />
                <Label htmlFor="comValor" className="text-sm font-normal">
                  Apenas eventos com valores financeiros
                </Label>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setMostrarFiltros(false)}>
                Cancelar
              </Button>
              <Button onClick={aplicarFiltros}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
