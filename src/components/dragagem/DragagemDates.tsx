
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, UseFormWatch } from 'react-hook-form';

interface DragagemDatesProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  isLoading: boolean;
}

export const DragagemDates = ({ control, watch, isLoading }: DragagemDatesProps) => {
  return (
    <>
      {/* Data de Início */}
      <FormField
        control={control}
        name="data_inicio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Início *</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                disabled={isLoading}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Data de Fim (Opcional) */}
      <FormField
        control={control}
        name="data_fim"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Fim (Opcional)</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                disabled={isLoading}
                className="w-full"
                min={watch('data_inicio')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
