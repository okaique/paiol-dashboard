
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { History, Info, Calendar, TrendingUp } from 'lucide-react';
import { CicloDetailsCard } from './CicloDetailsCard';
import { CicloNavigator } from './CicloNavigator';
import { HistoricoControls } from './HistoricoControls';
import { FiltrosHistorico } from './FiltrosHistorico';
import { EventoCompletoCard } from './EventoCompletoCard';
import { useHistoricoCiclos } from '@/hooks/useHistoricoCiclos';
import { useHistoricoCompleto } from '@/hooks/useHistoricoCompleto';
import type { Paiol } from '@/types/database';

interface HistoricoCiclosProps {
  paiol: Paiol;
}

export const HistoricoCiclos = ({ paiol }: HistoricoCiclosProps) => {
  const [cicloSelecionado, setCicloSelecionado] = useState(paiol.ciclo_atual);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'detalhado'>('lista');
  const [filtros, setFiltros] = useState({});

  const { data: dadosCiclos, isLoading: isLoadingCiclos } = useHistoricoCiclos(paiol);
  const { data: eventosCompletos, isLoading: isLoadingEventos } = useHistoricoCompleto(paiol, {
    ...filtros,
    ciclo: modoVisualizacao === 'detalhado' ? cicloSelecionado : undefined,
  });

  const handleViewCicloDetails = (ciclo: number) => {
    setCicloSelecionado(ciclo);
    setModoVisualizacao('detalhado');
  };

  const handleResetToAtual = () => {
    setCicloSelecionado(paiol.ciclo_atual);
    setModoVisualizacao('lista');
    setFiltros({});
  };

  const cicloAtualData = dadosCiclos?.find(c => c.ciclo === cicloSelecionado);
  const totalCiclos = Math.max(...(dadosCiclos?.map(c => c.ciclo) || [1]));

  // Estatísticas do ciclo selecionado
  const estatisticasCiclo = {
    totalEventos: eventosCompletos?.length || 0,
    eventosComValor: eventosCompletos?.filter(e => e.valor && e.valor > 0).length || 0,
    valorTotal: eventosCompletos?.reduce((acc, e) => acc + (e.valor || 0), 0) || 0,
  };

  if (isLoadingCiclos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico Completo de Ciclos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </CardContent>
      </Card>
    );
  }

  if (!dadosCiclos || dadosCiclos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico Completo de Ciclos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Nenhum histórico de ciclos encontrado. Os dados aparecerão aqui conforme o paiol for utilizado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico Completo de Ciclos
            </CardTitle>
            
            <HistoricoControls
              totalCiclos={dadosCiclos.length}
              modoVisualizacao={modoVisualizacao}
              onModoChange={setModoVisualizacao}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {modoVisualizacao === 'detalhado' && (
            <>
              <CicloNavigator
                cicloAtual={paiol.ciclo_atual}
                cicloSelecionado={cicloSelecionado}
                totalCiclos={totalCiclos}
                onCicloChange={setCicloSelecionado}
                onResetToAtual={handleResetToAtual}
              />

              {/* Estatísticas do ciclo */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{estatisticasCiclo.totalEventos}</div>
                      <div className="text-xs text-blue-700">Eventos no Ciclo</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{estatisticasCiclo.eventosComValor}</div>
                      <div className="text-xs text-green-700">Com Valores</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(estatisticasCiclo.valorTotal)}
                      </div>
                      <div className="text-xs text-orange-700">Valor Total</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {modoVisualizacao === 'lista' ? (
            // Visualização em Lista - usando apenas dados dos ciclos
            <div className="space-y-4">
              {dadosCiclos.map((cicloData) => (
                <CicloDetailsCard
                  key={cicloData.ciclo}
                  ciclo={cicloData.ciclo}
                  eventos={cicloData.eventos}
                  isAtual={cicloData.ciclo === paiol.ciclo_atual}
                  onViewDetails={handleViewCicloDetails}
                />
              ))}
            </div>
          ) : (
            // Visualização Detalhada de um Ciclo - usando eventos completos
            <div className="space-y-4">
              {cicloAtualData ? (
                <>
                  <CicloDetailsCard
                    ciclo={cicloAtualData.ciclo}
                    eventos={cicloAtualData.eventos}
                    isAtual={cicloAtualData.ciclo === paiol.ciclo_atual}
                  />

                  {/* Filtros para eventos do ciclo */}
                  <FiltrosHistorico 
                    onFiltrosChange={setFiltros}
                    filtrosAtivos={filtros}
                  />

                  {/* Timeline detalhada do ciclo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Timeline Detalhada - Ciclo {cicloSelecionado}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingEventos ? (
                        <p className="text-muted-foreground">Carregando eventos...</p>
                      ) : !eventosCompletos || eventosCompletos.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Nenhum evento encontrado para este ciclo
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {eventosCompletos.map((evento, index) => (
                            <EventoCompletoCard
                              key={evento.id}
                              evento={evento}
                              isLast={index === eventosCompletos.length - 1}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum dado encontrado para o Ciclo {cicloSelecionado}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
