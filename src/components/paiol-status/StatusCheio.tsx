
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calculator } from 'lucide-react';
import type { Paiol, Dragagem, Cubagem } from '@/types/database';

interface StatusCheioProps {
  paiol: Paiol;
  dragagemMaisRecente?: Dragagem;
  cubagem?: Cubagem;
}

export const StatusCheio = ({ paiol, dragagemMaisRecente, cubagem }: StatusCheioProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Status: Cheio</span>
            </div>
            {cubagem && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                Cubagem Realizada
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            O paiol está cheio e pronto para iniciar as retiradas de areia.
          </p>
          
          {/* Resumo de Volume */}
          {cubagem && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <p className="text-sm text-green-600 font-medium">Volume Normal (Calculado)</p>
                <p className="text-2xl font-bold text-green-700">
                  {cubagem.volume_normal.toFixed(3)}
                </p>
                <p className="text-xs text-green-600">m³</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600 font-medium">Volume Reduzido (Real)</p>
                <p className="text-2xl font-bold text-green-700">
                  {cubagem.volume_reduzido.toFixed(3)}
                </p>
                <p className="text-xs text-green-600">m³</p>
              </div>
            </div>
          )}

          {dragagemMaisRecente && (
            <div className="space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">Última dragagem finalizada:</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  Finalizada em: {new Date(dragagemMaisRecente.data_fim || dragagemMaisRecente.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Aviso se não há cubagem */}
      {!cubagem && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <Calculator className="h-5 w-5" />
              <p className="font-medium">Cubagem Pendente</p>
            </div>
            <p className="text-sm text-yellow-600 mt-2">
              A cubagem ainda não foi registrada para este paiol. 
              Registre a cubagem para ter informações precisas sobre o volume disponível.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
