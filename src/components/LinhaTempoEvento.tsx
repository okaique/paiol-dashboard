import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatarDataHoraBrasilia } from '@/utils/dateUtils';
import { Calendar, Clock, FileText, User } from 'lucide-react';

interface EventoTimeline {
  id: string;
  data: string;
  tipo: 'TRANSICAO' | 'DRAGAGEM' | 'CUBAGEM' | 'RETIRADA' | 'FECHAMENTO';
  titulo: string;
  descricao?: string;
  statusAnterior?: string;
  statusNovo?: string;
  usuario?: string;
  observacoes?: string;
  icone: React.ReactNode;
  cor: string;
}

interface LinhaTempoEventoProps {
  evento: EventoTimeline;
  isLast: boolean;
}

export const LinhaTempoEvento = ({ evento, isLast }: LinhaTempoEventoProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'VAZIO':
        return 'bg-gray-100 text-gray-800';
      case 'DRAGANDO':
        return 'bg-blue-100 text-blue-800';
      case 'CHEIO':
        return 'bg-green-100 text-green-800';
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
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center ${evento.cor}`}
        >
          {evento.icone}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[40px] bg-border mt-2" />
        )}
      </div>

      {/* Conteúdo do evento */}
      <div className="flex-1 min-w-0">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              {/* Cabeçalho do evento */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">
                    {evento.titulo}
                  </h4>
                  {evento.descricao && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {evento.descricao}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground ml-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatarDataHoraBrasilia(evento.data)}
                </div>
              </div>

              {/* Transição de status */}
              {evento.tipo === 'TRANSICAO' && evento.statusAnterior && evento.statusNovo && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  {evento.statusAnterior && (
                    <>
                      <Badge variant="outline" className={getStatusBadgeColor(evento.statusAnterior)}>
                        {evento.statusAnterior}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge variant="outline" className={getStatusBadgeColor(evento.statusNovo)}>
                    {evento.statusNovo}
                  </Badge>
                </div>
              )}

              {/* Informações adicionais */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {evento.usuario && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{evento.usuario}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Tipo: {evento.tipo}</span>
                </div>
              </div>

              {/* Observações */}
              {evento.observacoes && (
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      {evento.observacoes}
                    </p>
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