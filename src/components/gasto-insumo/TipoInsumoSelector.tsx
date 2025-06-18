
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';

interface TipoInsumoSelectorProps {
  control: Control<any>;
}

export const TipoInsumoSelector = ({ control }: TipoInsumoSelectorProps) => {
  const { data: tiposInsumos, isLoading: loadingTipos } = useTiposInsumos();

  // Filtrar tipos de insumos com ID válido - garantir que nunca seja string vazia
  const validTiposInsumos = tiposInsumos?.filter(tipo => 
    tipo.id && 
    typeof tipo.id === 'string' && 
    tipo.id.trim() !== '' &&
    tipo.nome &&
    typeof tipo.nome === 'string' &&
    tipo.nome.trim() !== ''
  ) || [];

  console.log('TipoInsumoSelector - tipos válidos:', validTiposInsumos);
  console.log('TipoInsumoSelector - loading:', loadingTipos);

  return (
    <FormField
      control={control}
      name="tipo_insumo_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Insumo *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""} disabled={loadingTipos}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo de insumo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validTiposInsumos.length > 0 ? (
                validTiposInsumos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome} ({tipo.categoria})
                  </SelectItem>
                ))
              ) : (
                <div className="px-8 py-2 text-sm text-muted-foreground">
                  {loadingTipos ? 'Carregando...' : 'Nenhum tipo de insumo cadastrado'}
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
