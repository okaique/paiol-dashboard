
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventoCiclo {
  tipo: 'transicao' | 'dragagem' | 'cubagem' | 'retirada' | 'fechamento';
  data: string;
  descricao: string;
  detalhes?: Record<string, any>;
}

interface CicloDetailsCardProps {
  ciclo: number;
  eventos: EventoCiclo[];
  isAtual: boolean;
  onViewDetails?: (ciclo: number) => void;
}

export const CicloDetailsCard = ({ 
  ciclo, 
  eventos, 
  isAtual, 
  onViewDetails 
}: CicloDetailsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'transicao':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'dragagem':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cubagem':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'retirada':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'fechamento':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPeriodoCiclo = () => {
    if (eventos.length === 0) return 'Sem dados';
    
    const primeiroEvento = eventos[eventos.length - 1];
    const ultimoEvento = eventos[0];
    
    const dataInicio = new Date(primeiroEvento.data);
    const dataFim = new Date(ultimoEvento.data);
    
    return `${format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })} - ${format(dataFim, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  const getDuracaoCiclo = () => {
    if (eventos.length === 0) return 'N/A';
    
    const primeiroEvento = eventos[eventos.length - 1];
    const ultimoEvento = eventos[0];
    
    const dataInicio = new Date(primeiroEvento.data);
    const dataFim = new Date(ultimoEvento.data);
    
    const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} dias`;
  };

  const getStatusFinal = () => {
    if (eventos.length === 0) return 'N/A';
    const ultimoEvento = eventos[0];
    return ultimoEvento.tipo.toUpperCase();
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'transicao': 'Transição',
      'dragagem': 'Dragagem',
      'cubagem': 'Cubagem',
      'retirada': 'Retirada',
      'fechamento': 'Fechamento'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  return (
    <Card className={`transition-all duration-200 ${isAtual ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">Ciclo {ciclo}</span>
            {isAtual && (
              <Badge variant="default" className="text-xs">
                Atual
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getStatusBadgeColor(getStatusFinal())}
            >
              {getStatusFinal()}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Resumo do Ciclo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Período</p>
            <p className="font-medium">{getPeriodoCiclo()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duração</p>
            <p className="font-medium">{getDuracaoCiclo()}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Total de Eventos</p>
          <p className="font-medium">{eventos.length} eventos</p>
        </div>

        {/* Detalhes Expandidos */}
        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Histórico de Eventos</h4>
              {eventos.map((evento, index) => (
                <div key={`${evento.tipo}-${index}`} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusBadgeColor(evento.tipo)}`}
                      >
                        {getTipoLabel(evento.tipo)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(evento.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    
                    <p className="text-sm text-foreground mb-1">{evento.descricao}</p>
                    
                    {evento.detalhes && Object.keys(evento.detalhes).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <FileText className="h-3 w-3 inline mr-1" />
                        Detalhes adicionais disponíveis
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ações */}
        {onViewDetails && (
          <>
            <Separator className="my-4" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(ciclo)}
              className="w-full"
            >
              Ver Detalhes Completos
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
