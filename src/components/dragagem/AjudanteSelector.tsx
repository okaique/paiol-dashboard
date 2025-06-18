
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import type { Ajudante } from '@/types/database';

interface AjudanteSelectorProps {
  control: Control<any>;
  ajudantes: Ajudante[] | undefined;
  isLoading: boolean;
}

export const AjudanteSelector = ({ control, ajudantes, isLoading }: AjudanteSelectorProps) => {
  // Filtrar ajudantes com ID válido - garantir que nunca seja string vazia
  const validAjudantes = ajudantes?.filter(ajudante => 
    ajudante.id && 
    typeof ajudante.id === 'string' && 
    ajudante.id.trim() !== '' &&
    ajudante.nome &&
    typeof ajudante.nome === 'string' &&
    ajudante.nome.trim() !== ''
  ) || [];

  console.log('AjudanteSelector - ajudantes válidos:', validAjudantes);
  console.log('AjudanteSelector - loading:', isLoading);

  return (
    <FormField
      control={control}
      name="ajudante_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ajudante (Opcional)</FormLabel>
          <Select 
            onValueChange={(value) => {
              // Se o valor for "none_selected", definir como string vazia
              field.onChange(value === "none_selected" ? "" : value);
            }} 
            value={field.value || "none_selected"} 
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ajudante (opcional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none_selected">Nenhum ajudante</SelectItem>
              {validAjudantes.length > 0 ? (
                validAjudantes.map((ajudante) => (
                  <SelectItem key={ajudante.id} value={ajudante.id}>
                    {ajudante.nome}
                    {ajudante.valor_diaria && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (R$ {ajudante.valor_diaria.toFixed(2)}/dia)
                      </span>
                    )}
                  </SelectItem>
                ))
              ) : (
                <div className="px-8 py-2 text-sm text-muted-foreground">
                  {isLoading ? 'Carregando...' : 'Nenhum ajudante cadastrado'}
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
