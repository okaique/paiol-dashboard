
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, useWatch } from 'react-hook-form';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';

interface QuantidadeValorFieldsProps {
  control: Control<any>;
}

export const QuantidadeValorFields = ({ control }: QuantidadeValorFieldsProps) => {
  const { data: tiposInsumos } = useTiposInsumos();
  
  const tipoInsumoId = useWatch({ control, name: 'tipo_insumo_id' });
  const quantidade = useWatch({ control, name: 'quantidade' });
  const valorUnitario = useWatch({ control, name: 'valor_unitario' });
  
  const tipoInsumoSelecionado = tiposInsumos?.find(tipo => tipo.id === tipoInsumoId);
  
  // Garantir que ambos valores sejam números válidos antes de calcular
  const quantidadeNum = Number(quantidade) || 0;
  const valorUnitarioNum = Number(valorUnitario) || 0;
  const valorTotal = quantidadeNum * valorUnitarioNum;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quantidade * {tipoInsumoSelecionado && `(${tipoInsumoSelecionado.unidade_medida})`}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.001" 
                  placeholder="0.000"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : parseFloat(value);
                    field.onChange(isNaN(numValue) ? 0 : numValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="valor_unitario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Unitário *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : parseFloat(value);
                    field.onChange(isNaN(numValue) ? 0 : numValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {valorTotal > 0 && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">
            Valor Total: R$ {valorTotal.toFixed(2)}
          </p>
        </div>
      )}
    </>
  );
};
