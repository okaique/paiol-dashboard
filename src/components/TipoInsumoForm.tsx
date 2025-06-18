
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTipoInsumoMutations } from '@/hooks/useTipoInsumoMutations';
import { useBusinessValidations } from '@/hooks/useBusinessValidations';
import { ValidationErrors } from './ValidationErrors';
import type { TipoInsumo } from '@/types/database';

const tipoInsumoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  unidade_medida: z.string().min(1, 'Unidade de medida é obrigatória'),
  observacoes: z.string().optional(),
});

type TipoInsumoFormData = z.infer<typeof tipoInsumoSchema>;

interface TipoInsumoFormProps {
  tipoInsumo?: TipoInsumo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TipoInsumoForm = ({ tipoInsumo, onSuccess, onCancel }: TipoInsumoFormProps) => {
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const { createTipoInsumo, updateTipoInsumo } = useTipoInsumoMutations();
  const { validateTipoInsumo } = useBusinessValidations();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TipoInsumoFormData>({
    resolver: zodResolver(tipoInsumoSchema),
    defaultValues: {
      nome: tipoInsumo?.nome || '',
      categoria: tipoInsumo?.categoria || '',
      unidade_medida: tipoInsumo?.unidade_medida || 'LITRO',
      observacoes: tipoInsumo?.observacoes || '',
    },
  });

  const onSubmit = async (data: TipoInsumoFormData) => {
    setValidationErrors([]);
    
    try {
      // Executar validações de negócio
      const businessErrors = validateTipoInsumo({ ...data, id: tipoInsumo?.id });
      
      if (businessErrors.filter(e => e.type === 'error').length > 0) {
        setValidationErrors(businessErrors);
        return;
      }

      // Mostrar warnings mas permitir continuar
      if (businessErrors.filter(e => e.type === 'warning').length > 0) {
        setValidationErrors(businessErrors);
      }

      // Create the properly typed data object
      const mutationData = {
        nome: data.nome,
        categoria: data.categoria,
        unidade_medida: data.unidade_medida,
        observacoes: data.observacoes,
      };

      if (tipoInsumo) {
        await updateTipoInsumo.mutateAsync({ id: tipoInsumo.id, data: mutationData });
      } else {
        await createTipoInsumo.mutateAsync(mutationData);
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

  const isLoading = createTipoInsumo.isPending || updateTipoInsumo.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tipoInsumo ? 'Editar Tipo de Insumo' : 'Novo Tipo de Insumo'}
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
              placeholder="Nome do insumo"
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={watch('categoria')}
              onValueChange={(value) => setValue('categoria', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMBUSTIVEL">Combustível</SelectItem>
                <SelectItem value="OLEO">Óleo</SelectItem>
                <SelectItem value="FILTRO">Filtro</SelectItem>
                <SelectItem value="PECAS">Peças</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-destructive">{errors.categoria.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidade_medida">Unidade de Medida *</Label>
            <Select
              value={watch('unidade_medida')}
              onValueChange={(value) => setValue('unidade_medida', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LITRO">Litro</SelectItem>
                <SelectItem value="QUILO">Quilo</SelectItem>
                <SelectItem value="UNIDADE">Unidade</SelectItem>
                <SelectItem value="METRO">Metro</SelectItem>
                <SelectItem value="CAIXA">Caixa</SelectItem>
              </SelectContent>
            </Select>
            {errors.unidade_medida && (
              <p className="text-sm text-destructive">{errors.unidade_medida.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações sobre o tipo de insumo..."
              rows={3}
            />
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
              {isLoading ? 'Salvando...' : (tipoInsumo ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
