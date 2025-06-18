
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface VolumeInputProps {
  value: number;
  onChange: (value: number) => void;
  volumeError?: string;
  fieldError?: string;
  volumeDisponivel?: number;
  volumeTotal?: number;
}

export const VolumeInput = ({ 
  value, 
  onChange, 
  volumeError, 
  fieldError,
  volumeDisponivel = 0,
  volumeTotal = 0
}: VolumeInputProps) => {
  const excedeuVolume = value > volumeDisponivel && volumeDisponivel > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="volume_retirado">Volume Retirado (m³) *</Label>
      <Input
        id="volume_retirado"
        type="number"
        step="0.01"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={volumeError ? 'border-destructive' : ''}
      />
      
      {excedeuVolume && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Volume excede o calculado</p>
            <p className="text-sm mt-1">
              O volume informado ({value.toFixed(2)} m³) excede o volume disponível calculado 
              ({volumeDisponivel.toFixed(2)} m³).
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {volumeError && (
        <Alert variant="destructive">
          <AlertDescription>{volumeError}</AlertDescription>
        </Alert>
      )}
      
      {fieldError && (
        <p className="text-sm text-destructive">{fieldError}</p>
      )}
    </div>
  );
};
