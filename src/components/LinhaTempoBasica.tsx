
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { FiltrosHistorico } from './FiltrosHistorico';
import { EventoCompletoCard } from './EventoCompletoCard';
import { useHistoricoCompleto } from '@/hooks/useHistoricoCompleto';
import type { Paiol } from '@/types/database';

interface LinhaTempoBasicaProps {
  paiol: Paiol;
}

export const LinhaTempoBasica = ({ paiol }: LinhaTempoBasicaProps) => {
  const [filtros, setFiltros] = useState({});
  
  const { data: eventos, isLoading } = useHistoricoCompleto(paiol, filtros);

  const estatisticas = {
    totalEventos: eventos?.length || 0,
    eventosComValor: eventos?.filter(e => e.valor && e.valor > 0).length || 0,
    valorTotal: eventos?.reduce((acc, e) => acc + (e.valor || 0), 0) || 0,
    tiposUnicos: [...new Set(eventos?.map(e => e.tipo) || [])].length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline Completa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{estatisticas.totalEventos}</div>
              <div className="text-xs text-muted-foreground">Total de Eventos</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{estatisticas.eventosComValor}</div>
              <div className="text-xs text-muted-foreground">Com Valores</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{estatisticas.tiposUnicos}</div>
              <div className="text-xs text-muted-foreground">Tipos Diferentes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(estatisticas.valorTotal)}
              </div>
              <div className="text-xs text-muted-foreground">Valor Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <FiltrosHistorico 
        onFiltrosChange={setFiltros}
        filtrosAtivos={filtros}
      />

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline Completa
            </div>
            <Badge variant="secondary">
              {eventos?.length || 0} evento{(eventos?.length || 0) !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!eventos || eventos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {Object.keys(filtros).length > 0 
                  ? 'Nenhum evento encontrado com os filtros aplicados'
                  : 'Nenhum evento registrado ainda'
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {Object.keys(filtros).length > 0 
                  ? 'Tente ajustar os filtros para ver mais eventos'
                  : 'Os eventos e atividades do paiol aparecerão aqui conforme forem registrados'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {eventos.map((evento, index) => (
                <EventoCompletoCard
                  key={evento.id}
                  evento={evento}
                  isLast={index === eventos.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
