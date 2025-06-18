
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCaminhoes } from '@/hooks/useCaminhoes';
import { UseFormReturn } from 'react-hook-form';

interface FreteFieldsProps {
  form: UseFormReturn<any>;
}

export const FreteFields = ({ form }: FreteFieldsProps) => {
  const { data: caminhoes = [] } = useCaminhoes();
  const watchedValues = form.watch();
  const temFrete = watchedValues.tem_frete || false;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tem_frete"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <Label>Tem Frete</Label>
            </div>
          </FormItem>
        )}
      />

      {temFrete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valor_frete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Frete (R$)</FormLabel>
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

          <FormField
            control={form.control}
            name="caminhao_frete_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caminhão do Frete</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um caminhão" />
                    </SelectTrigger>
                    <SelectContent>
                      {caminhoes.map((caminhao) => (
                        <SelectItem key={caminhao.id} value={caminhao.id}>
                          {caminhao.placa} - {caminhao.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};
