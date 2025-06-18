
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BarChart3, Info } from 'lucide-react';

interface VolumeInfoProps {
  volumeTotal: number;
  volumeRetirado: number;
  volumeDisponivel: number;
  percentualUtilizado: number;
}

export const VolumeInfo = ({
  volumeTotal,
  volumeRetirado,
  volumeDisponivel,
  percentualUtilizado,
}: VolumeInfoProps) => {
  const excedeuVolume = volumeRetirado > volumeTotal && volumeTotal > 0;
  const volumeExcedente = excedeuVolume ? volumeRetirado - volumeTotal : 0;
  const volumeDisponivelReal = Math.max(0, volumeDisponivel);

  const getStatusColor = () => {
    if (percentualUtilizado >= 100) return 'destructive';
    if (percentualUtilizado >= 80) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (percentualUtilizado >= 100) return 'Excedido';
    if (percentualUtilizado >= 80) return 'Crítico';
    return 'Normal';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Controle de Volume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {volumeTotal.toFixed(2)} m³
            </div>
            <div className="text-sm text-muted-foreground">Volume Total (Estimado)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {volumeRetirado.toFixed(2)} m³
            </div>
            <div className="text-sm text-muted-foreground">Volume Retirado</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${volumeDisponivelReal <= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {volumeDisponivelReal.toFixed(2)} m³
            </div>
            <div className="text-sm text-muted-foreground">Volume Disponível</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso de Retirada</span>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor()}>
                {getStatusText()}
              </Badge>
              <span className="text-sm font-medium">
                {percentualUtilizado.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress value={Math.min(percentualUtilizado, 100)} className="h-3" />
        </div>

        {excedeuVolume && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Volume Excedente</p>
              <p className="text-red-700">
                Foram retirados <strong>{volumeExcedente.toFixed(2)} m³</strong> além do volume calculado.
              </p>
            </div>
          </div>
        )}

        {volumeDisponivelReal <= 0 && !excedeuVolume && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <Info className="h-4 w-4 text-orange-600" />
            <div className="text-sm">
              <p className="font-medium text-orange-800">Volume Esgotado</p>
              <p className="text-orange-700">
                O volume estimado foi totalmente retirado. Novas retiradas ainda são permitidas.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
