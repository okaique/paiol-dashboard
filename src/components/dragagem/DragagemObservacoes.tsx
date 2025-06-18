
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface DragagemObservacoesProps {
  control: Control<any>;
  isLoading: boolean;
}

export const DragagemObservacoes = ({ control, isLoading }: DragagemObservacoesProps) => {
  return (
    <FormField
      control={control}
      name="observacoes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Observações sobre a dragagem..."
              {...field}
              disabled={isLoading}
              rows={3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
