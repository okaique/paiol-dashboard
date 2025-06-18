
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import type { Dragador } from '@/types/database';

interface DragadorSelectorProps {
  control: Control<any>;
  dragadores: Dragador[] | undefined;
  isLoading: boolean;
}

export const DragadorSelector = ({ control, dragadores, isLoading }: DragadorSelectorProps) => {
  // Filtrar dragadores com ID válido - garantir que nunca seja string vazia
  const validDragadores = dragadores?.filter(dragador => 
    dragador.id && 
    typeof dragador.id === 'string' && 
    dragador.id.trim() !== '' &&
    dragador.nome &&
    typeof dragador.nome === 'string' &&
    dragador.nome.trim() !== ''
  ) || [];

  console.log('DragadorSelector - dragadores válidos:', validDragadores);
  console.log('DragadorSelector - loading:', isLoading);

  return (
    <FormField
      control={control}
      name="dragador_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dragador *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoading}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um dragador" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validDragadores.length > 0 ? (
                validDragadores.map((dragador) => (
                  <SelectItem key={dragador.id} value={dragador.id}>
                    {dragador.nome}
                    {dragador.valor_diaria && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (R$ {dragador.valor_diaria.toFixed(2)}/dia)
                      </span>
                    )}
                  </SelectItem>
                ))
              ) : (
                <div className="px-8 py-2 text-sm text-muted-foreground">
                  {isLoading ? 'Carregando...' : 'Nenhum dragador cadastrado'}
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
