
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTipoGastoMutations } from '@/hooks/useTipoGastoMutations';
import { useBusinessValidations } from '@/hooks/useBusinessValidations';
import { ValidationErrors } from './ValidationErrors';
import type { TipoGasto } from '@/types/database';

const tipoGastoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean().default(true),
});

type TipoGastoFormData = z.infer<typeof tipoGastoSchema>;

interface TipoGastoFormProps {
  tipoGasto?: TipoGasto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TipoGastoForm = ({ tipoGasto, onSuccess, onCancel }: TipoGastoFormProps) => {
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const { createTipoGasto, updateTipoGasto } = useTipoGastoMutations();
  const { validateTipoGasto } = useBusinessValidations();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TipoGastoFormData>({
    resolver: zodResolver(tipoGastoSchema),
    defaultValues: {
      nome: tipoGasto?.nome || '',
      ativo: tipoGasto?.ativo ?? true,
    },
  });

  const onSubmit = async (data: TipoGastoFormData) => {
    setValidationErrors([]);
    
    try {
      // Executar validações de negócio
      const businessErrors = validateTipoGasto({ ...data, id: tipoGasto?.id });
      
      if (businessErrors.filter(e => e.type === 'error').length > 0) {
        setValidationErrors(businessErrors);
        return;
      }

      // Mostrar warnings mas permitir continuar
      if (businessErrors.filter(e => e.type === 'warning').length > 0) {
        setValidationErrors(businessErrors);
      }

      // Garantir que nome seja sempre string válida
      const submitData = {
        nome: data.nome.trim(),
        ativo: data.ativo,
      };

      if (tipoGasto) {
        await updateTipoGasto.mutateAsync({ id: tipoGasto.id, ...submitData });
      } else {
        await createTipoGasto.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro no formulário:', error);
      setValidationErrors([{ 
        message: 'Erro interno do servidor. Tente novamente.', 
        type: 'error' 
      }]);
    }
  };

  const isLoading = createTipoGasto.isPending || updateTipoGasto.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tipoGasto ? 'Editar Tipo de Gasto' : 'Novo Tipo de Gasto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ValidationErrors errors={validationErrors} />
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              {...register('nome')}
              placeholder="Nome do tipo de gasto"
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={watch('ativo')}
              onCheckedChange={(checked) => setValue('ativo', checked)}
            />
            <Label htmlFor="ativo">Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (tipoGasto ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
