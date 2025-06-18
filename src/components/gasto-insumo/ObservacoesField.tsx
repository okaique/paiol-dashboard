
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface ObservacoesFieldProps {
  control: Control<any>;
}

export const ObservacoesField = ({ control }: ObservacoesFieldProps) => {
  return (
    <FormField
      control={control}
      name="observacoes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Observações sobre o gasto"
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
