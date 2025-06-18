
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VolumeCalculation } from './VolumeCalculation';
import { Calendar, FileText, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Cubagem } from '@/types/database';

interface CubagemInfoProps {
  cubagem: Cubagem;
}

export const CubagemInfo = ({ cubagem }: CubagemInfoProps) => {
  const perdaVolume = cubagem.volume_normal - cubagem.volume_reduzido;
  const percentualPerda = (perdaVolume / cubagem.volume_normal) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Informações da Cubagem
            </div>
            <Badge variant="secondary">
              {new Date(cubagem.data_cubagem).toLocaleDateString('pt-BR')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Volumes Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Volume Normal</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 mb-1">
                {cubagem.volume_normal.toFixed(3)} m³
              </p>
              <p className="text-xs text-blue-600">Volume bruto calculado</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Volume Reduzido</span>
              </div>
              <p className="text-2xl font-bold text-green-800 mb-1">
                {cubagem.volume_reduzido.toFixed(3)} m³
              </p>
              <p className="text-xs text-green-600">Volume líquido (85%)</p>
            </div>
          </div>

          {/* Informações de Perda */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Análise de Perda</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold text-orange-800">
                  {perdaVolume.toFixed(3)} m³
                </p>
                <p className="text-xs text-orange-600">Volume perdido</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-orange-800">
                  {percentualPerda.toFixed(1)}%
                </p>
                <p className="text-xs text-orange-600">Percentual de perda</p>
              </div>
            </div>
          </div>

          {/* Medições Utilizadas */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Medições Registradas</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Medida Inferior:</span>
                <p className="font-medium">{cubagem.medida_inferior.toFixed(3)} m³</p>
              </div>
              <div>
                <span className="text-muted-foreground">Medida Superior:</span>
                <p className="font-medium">{cubagem.medida_superior.toFixed(3)} m³</p>
              </div>
              <div>
                <span className="text-muted-foreground">Perímetro:</span>
                <p className="font-medium">{cubagem.perimetro.toFixed(3)} m</p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
            <div>
              <span className="text-muted-foreground">Data da Cubagem:</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">
                  {new Date(cubagem.data_cubagem).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Registrado em:</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">
                  {new Date(cubagem.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {cubagem.observacoes && (
            <div className="border-t pt-3">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">Observações:</span>
                  <p className="text-sm mt-1 bg-muted p-3 rounded">
                    {cubagem.observacoes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cálculos detalhados */}
      <VolumeCalculation
        medidaInferior={cubagem.medida_inferior}
        medidaSuperior={cubagem.medida_superior}
        perimetro={cubagem.perimetro}
        showFormula={false}
      />
    </div>
  );
};
