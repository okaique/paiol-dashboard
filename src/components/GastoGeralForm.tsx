
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
import { useGastoGeralMutations } from '@/hooks/useGastoGeralMutations';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useTiposGastos } from '@/hooks/useTiposGastos';
import { ValidationErrors } from './ValidationErrors';
import type { GastoGeral } from '@/types/database';

const gastoGeralSchema = z.object({
  equipamento_id: z.string().min(1, 'Equipamento é obrigatório'),
  tipo_id: z.string().min(1, 'Tipo de gasto é obrigatório'),
  data: z.string().min(1, 'Data é obrigatória'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  responsavel: z.string().optional(),
  observacoes: z.string().optional(),
});

type GastoGeralFormData = z.infer<typeof gastoGeralSchema>;

interface GastoGeralFormProps {
  gastoGeral?: GastoGeral;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GastoGeralForm = ({ gastoGeral, onSuccess, onCancel }: GastoGeralFormProps) => {
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const { createGastoGeral, updateGastoGeral } = useGastoGeralMutations();
  const { data: equipamentos = [] } = useEquipamentos();
  const { data: tiposGastos = [] } = useTiposGastos();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GastoGeralFormData>({
    resolver: zodResolver(gastoGeralSchema),
    defaultValues: {
      equipamento_id: gastoGeral?.equipamento_id || '',
      tipo_id: gastoGeral?.tipo_id || '',
      data: gastoGeral?.data ? gastoGeral.data.split('T')[0] : new Date().toISOString().split('T')[0],
      valor: gastoGeral?.valor || 0,
      responsavel: gastoGeral?.responsavel || '',
      observacoes: gastoGeral?.observacoes || '',
    },
  });

  const onSubmit = async (data: GastoGeralFormData) => {
    setValidationErrors([]);
    
    try {
      const submitData = {
        equipamento_id: data.equipamento_id,
        tipo_id: data.tipo_id,
        data: new Date(data.data).toISOString(),
        valor: data.valor,
        responsavel: data.responsavel?.trim() || undefined,
        observacoes: data.observacoes?.trim() || undefined,
      };

      if (gastoGeral) {
        await updateGastoGeral.mutateAsync({ id: gastoGeral.id, ...submitData });
      } else {
        await createGastoGeral.mutateAsync(submitData);
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

  const isLoading = createGastoGeral.isPending || updateGastoGeral.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {gastoGeral ? 'Editar Gasto Geral' : 'Novo Gasto Geral'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ValidationErrors errors={validationErrors} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipamento_id">Equipamento *</Label>
              <Select
                value={watch('equipamento_id')}
                onValueChange={(value) => setValue('equipamento_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  {equipamentos.map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.id}>
                      {equipamento.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.equipamento_id && (
                <p className="text-sm text-destructive">{errors.equipamento_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_id">Tipo de Gasto *</Label>
              <Select
                value={watch('tipo_id')}
                onValueChange={(value) => setValue('tipo_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo de gasto" />
                </SelectTrigger>
                <SelectContent>
                  {tiposGastos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_id && (
                <p className="text-sm text-destructive">{errors.tipo_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                {...register('data')}
              />
              {errors.data && (
                <p className="text-sm text-destructive">{errors.data.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                {...register('valor', { valueAsNumber: true })}
                placeholder="0,00"
              />
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              {...register('responsavel')}
              placeholder="Nome do responsável"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações sobre o gasto..."
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
              {isLoading ? 'Salvando...' : (gastoGeral ? 'Atualizar' : 'Registrar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
