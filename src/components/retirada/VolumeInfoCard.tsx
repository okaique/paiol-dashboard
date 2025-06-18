
import { Info, AlertTriangle } from 'lucide-react';

interface VolumeInfoCardProps {
  volumeTotal: number;
  volumeRetirado: number;
  volumeDisponivel: number;
}

export const VolumeInfoCard = ({ 
  volumeTotal, 
  volumeRetirado, 
  volumeDisponivel 
}: VolumeInfoCardProps) => {
  const excedeuVolume = volumeRetirado > volumeTotal && volumeTotal > 0;
  const volumeExcedente = excedeuVolume ? volumeRetirado - volumeTotal : 0;
  const volumeDisponivelReal = Math.max(0, volumeDisponivel);
  const percentualRetirado = volumeTotal > 0 ? (volumeRetirado / volumeTotal) * 100 : 0;

  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Info className="h-4 w-4" />
        Controle de Volume
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Calculado:</span>
          <div className="font-medium text-blue-600">{volumeTotal.toFixed(2)} m³</div>
        </div>
        <div>
          <span className="text-muted-foreground">Já Retirado:</span>
          <div className="font-medium text-orange-600">{volumeRetirado.toFixed(2)} m³</div>
        </div>
        <div>
          <span className="text-muted-foreground">Disponível (Estimado):</span>
          <div className={`font-medium ${volumeDisponivelReal <= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {volumeDisponivelReal.toFixed(2)} m³
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Progresso de Retirada</span>
          <span className={`font-medium ${percentualRetirado >= 100 ? 'text-red-600' : 'text-blue-600'}`}>
            {percentualRetirado.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${
              percentualRetirado >= 100 ? 'bg-red-500' : 
              percentualRetirado >= 80 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentualRetirado, 100)}%` }}
          />
        </div>
      </div>
      
      {excedeuVolume && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <p className="font-medium">Volume Excedente Retirado</p>
            <p className="text-sm mt-1">
              Foram retirados <strong>{volumeExcedente.toFixed(2)} m³</strong> além do volume calculado.
              O volume calculado é apenas uma estimativa.
            </p>
          </div>
        </div>
      )}
      
      {volumeDisponivelReal <= 0 && !excedeuVolume && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded-md text-sm">
          <Info className="h-4 w-4" />
          <div>
            <p className="font-medium">Volume Calculado Esgotado</p>
            <p className="text-sm mt-1">
              O volume estimado foi totalmente retirado. Novas retiradas ainda são permitidas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
