
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VolumeCalculationProps {
  medidaInferior: number;
  medidaSuperior: number;
  perimetro: number;
  showFormula?: boolean;
}

export const VolumeCalculation = ({ 
  medidaInferior, 
  medidaSuperior, 
  perimetro, 
  showFormula = false 
}: VolumeCalculationProps) => {
  // Validações matemáticas
  const isValidInput = medidaInferior > 0 && medidaSuperior > 0 && perimetro > 0;
  
  if (!isValidInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cálculo de Volume do Cilindro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Insira valores válidos para calcular o volume.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Cálculos do cilindro
  const raio = perimetro / (2 * Math.PI); // r = perímetro / (2π)
  const altura = (medidaInferior + medidaSuperior) / 2; // altura média
  const areaDaBase = Math.PI * Math.pow(raio, 2); // π * r²
  const volumeNormal = altura * areaDaBase; // Volume do cilindro
  
  // Validações adicionais
  const hasWarnings = [];
  
  if (Math.abs(medidaInferior - medidaSuperior) > (Math.max(medidaInferior, medidaSuperior) * 0.5)) {
    hasWarnings.push('Grande diferença entre medidas superior e inferior');
  }
  
  if (perimetro < 10) {
    hasWarnings.push('Perímetro muito pequeno - verifique a medição');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cálculo de Volume do Cilindro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fórmula (se solicitada) */}
        {showFormula && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Fórmula utilizada:</p>
            <p>Raio = Perímetro ÷ (2 × π)</p>
            <p>Altura = (Medida Inferior + Medida Superior) ÷ 2</p>
            <p>Volume Normal = Altura × (π × r²)</p>
          </div>
        )}

        {/* Cálculos detalhados */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Medida Inferior:</span>
              <p className="font-medium">{medidaInferior.toFixed(3)} m³</p>
            </div>
            <div>
              <span className="text-muted-foreground">Medida Superior:</span>
              <p className="font-medium">{medidaSuperior.toFixed(3)} m³</p>
            </div>
            <div>
              <span className="text-muted-foreground">Perímetro:</span>
              <p className="font-medium">{perimetro.toFixed(3)} m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Raio Calculado:</span>
              <p className="font-medium">{raio.toFixed(3)} m</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-md">
                <span className="text-sm text-green-600">Altura Média:</span>
                <p className="text-lg font-bold text-green-700">
                  {altura.toFixed(3)} m
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ({medidaInferior.toFixed(1)} + {medidaSuperior.toFixed(1)}) ÷ 2
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <span className="text-sm text-blue-600">Área da Base:</span>
                <p className="text-lg font-bold text-blue-700">
                  {areaDaBase.toFixed(3)} m²
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  π × {raio.toFixed(2)}²
                </p>
              </div>
              
              <div className="bg-primary/10 p-3 rounded-md">
                <span className="text-sm text-primary">Volume Normal:</span>
                <p className="text-xl font-bold text-primary">
                  {volumeNormal.toFixed(3)} m³
                </p>
                <p className="text-xs text-primary mt-1">
                  {altura.toFixed(2)} × {areaDaBase.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <p>Fórmula do cilindro: V = h × π × r²</p>
            <p>Este é apenas o cálculo do volume normal. Insira o volume reduzido manualmente.</p>
          </div>
        </div>

        {/* Avisos de validação */}
        {hasWarnings.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {hasWarnings.map((warning, index) => (
                  <p key={index}>• {warning}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
