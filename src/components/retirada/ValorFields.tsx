
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface ValorFieldsProps {
  form: UseFormReturn<any>;
}

export const ValorFields = ({ form }: ValorFieldsProps) => {
  const watchedValues = form.watch();
  const volume = watchedValues.volume_retirado || 0;
  const valorUnitario = watchedValues.valor_unitario || 0;

  return (
    <>
      <FormField
        control={form.control}
        name="valor_unitario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor Unitário (R$/m³)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                value={field.value || ''}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {valorUnitario && volume && (
        <div className="bg-primary/5 p-3 rounded-lg">
          <div className="text-sm font-medium">
            Valor Total: R$ {(valorUnitario * volume).toFixed(2)}
          </div>
        </div>
      )}
    </>
  );
};
