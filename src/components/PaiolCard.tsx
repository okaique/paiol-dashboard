
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Activity, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaiolActions } from "./PaiolActions";
import type { Paiol } from "@/types/database";

interface PaiolCardProps {
  paiol: Paiol;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'VAZIO':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'DRAGANDO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CHEIO':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'RETIRANDO':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  return <Activity className="h-4 w-4" />;
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'VAZIO':
      return 'Vazio';
    case 'DRAGANDO':
      return 'Dragagem em andamento';
    case 'CHEIO':
      return 'Cheio';
    case 'RETIRANDO':
      return 'Retirando';
    default:
      return status;
  }
};

export const PaiolCard = ({ paiol }: PaiolCardProps) => {
  const navigate = useNavigate();

  console.log('Renderizando PaiolCard para:', paiol.nome, 'Status:', paiol.status);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/20">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 mb-2">
          <CardTitle className="text-lg font-semibold">{paiol.nome}</CardTitle>
          <Badge className={`w-fit ${getStatusColor(paiol.status)}`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(paiol.status)}
              <span>{getStatusText(paiol.status)}</span>
            </div>
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{paiol.localizacao}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ciclo Atual:</span>
            <span className="font-medium">{paiol.ciclo_atual}</span>
          </div>
          {paiol.data_abertura && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Data Abertura:</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">
                  {new Date(paiol.data_abertura).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          )}
          {paiol.observacoes && (
            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground">{paiol.observacoes}</p>
            </div>
          )}
        </div>
        
        {/* Botão Ver Detalhes */}
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mb-3"
            onClick={() => navigate(`/paiols/${paiol.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          
          {/* Ações do Paiol */}
          <PaiolActions paiol={paiol} />
        </div>
      </CardContent>
    </Card>
  );
};
