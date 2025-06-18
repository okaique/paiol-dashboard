import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EventoCompleto } from '@/hooks/useHistoricoCompleto';
import { formatarDataHoraBrasilia } from '@/utils/dateUtils';
import {
  Calculator,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Fuel,
  MapPin,
  Package,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Truck
} from 'lucide-react';

interface EventoCompletoCardProps {
  evento: EventoCompleto;
  isLast: boolean;
}

export const EventoCompletoCard = ({ evento, isLast }: EventoCompletoCardProps) => {
  const getEventoConfig = (tipo: string) => {
    switch (tipo) {
      case 'TRANSICAO':
        return {
          icone: <RotateCcw className="h-4 w-4 text-white" />,
          cor: 'bg-blue-500',
          badge: 'Status',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'DRAGAGEM_INICIO':
        return {
          icone: <PlayCircle className="h-4 w-4 text-white" />,
          cor: 'bg-green-500',
          badge: 'Dragagem',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'DRAGAGEM_FIM':
        return {
          icone: <PauseCircle className="h-4 w-4 text-white" />,
          cor: 'bg-green-600',
          badge: 'Dragagem',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'CUBAGEM':
        return {
          icone: <Calculator className="h-4 w-4 text-white" />,
          cor: 'bg-purple-500',
          badge: 'Cubagem',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'RETIRADA':
        return {
          icone: <Truck className="h-4 w-4 text-white" />,
          cor: 'bg-orange-500',
          badge: 'Retirada',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'PAGAMENTO':
        return {
          icone: <CreditCard className="h-4 w-4 text-white" />,
          cor: 'bg-yellow-500',
          badge: 'Pagamento',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'GASTO_INSUMO':
        return {
          icone: <Fuel className="h-4 w-4 text-white" />,
          cor: 'bg-red-500',
          badge: 'Insumo',
          badgeColor: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icone: <Package className="h-4 w-4 text-white" />,
          cor: 'bg-gray-500',
          badge: 'Evento',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getEventoConfig(evento.tipo);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'VAZIO':
        return 'bg-gray-100 text-gray-800';
      case 'DRAGANDO':
        return 'bg-blue-100 text-blue-800';
      case 'CHEIO':
        return 'bg-purple-100 text-purple-800';
      case 'RETIRANDO':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-start space-x-4 pb-6">
      {/* Linha vertical e ícone */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.cor}`}>
          {config.icone}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />
        )}
      </div>

      {/* Conteúdo do evento */}
      <div className="flex-1 min-w-0">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Cabeçalho */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={config.badgeColor}>
                      {config.badge}
                    </Badge>
                    {evento.status_associado && (
                      <Badge variant="outline" className={getStatusBadgeColor(evento.status_associado)}>
                        <MapPin className="h-3 w-3 mr-1" />
                        {evento.status_associado}
                      </Badge>
                    )}
                    {evento.valor && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {formatarValor(evento.valor)}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    {evento.titulo}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {evento.descricao}
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground ml-4">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatarDataHoraBrasilia(evento.data)}
                </div>
              </div>

              {/* Transição de status */}
              {evento.tipo === 'TRANSICAO' && evento.status_anterior && evento.status_novo && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  {evento.status_anterior && (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        {evento.status_anterior}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge variant="default" className="text-xs">
                    {evento.status_novo}
                  </Badge>
                </div>
              )}

              {/* Detalhes específicos */}
              {evento.detalhes && Object.keys(evento.detalhes).length > 0 && (
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {Object.entries(evento.detalhes).map(([chave, valor]) => {
                      if (valor === null || valor === undefined || valor === '') return null;
                      
                      return (
                        <div key={chave} className="flex justify-between">
                          <span className="text-muted-foreground font-medium">
                            {chave}:
                          </span>
                          <span className="font-medium text-right">
                            {String(valor)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Observações */}
              {evento.observacoes && (
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Observações:</p>
                      <p className="text-xs text-foreground">
                        {evento.observacoes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};