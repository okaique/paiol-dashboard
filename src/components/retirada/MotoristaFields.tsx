
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface MotoristaFieldsProps {
  form: UseFormReturn<any>;
}

export const MotoristaFields = ({ form }: MotoristaFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dados do Motorista</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="motorista_nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Motorista</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="motorista_cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF do Motorista</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="placa_informada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placa do Veículo</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ABC-1234"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
