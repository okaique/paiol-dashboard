
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface DataFornecedorFieldsProps {
  control: Control<any>;
}

export const DataFornecedorFields = ({ control }: DataFornecedorFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="data_gasto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data do Gasto *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fornecedor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fornecedor</FormLabel>
            <FormControl>
              <Input placeholder="Nome do fornecedor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
