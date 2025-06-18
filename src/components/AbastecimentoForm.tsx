
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CreateAbastecimentoData } from '@/types/abastecimentos';
import { useAbastecimentoMutations } from '@/hooks/useAbastecimentoMutations';

const abastecimentoSchema = z.object({
  data: z.date(),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  litragem: z.number().min(0, 'Litragem deve ser positiva'),
  km_atual: z.number().optional(),
  responsavel: z.string().optional(),
  observacoes: z.string().optional(),
});

type AbastecimentoFormData = z.infer<typeof abastecimentoSchema>;

interface AbastecimentoFormProps {
  equipamentoId: string;
  onSuccess?: () => void;
}

export function AbastecimentoForm({ equipamentoId, onSuccess }: AbastecimentoFormProps) {
  const { createAbastecimento } = useAbastecimentoMutations();
  const [dateOpen, setDateOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AbastecimentoFormData>({
    resolver: zodResolver(abastecimentoSchema),
    defaultValues: {
      data: new Date(),
    },
  });

  const selectedDate = watch('data');

  const onSubmit = async (data: AbastecimentoFormData) => {
    const abastecimentoData: CreateAbastecimentoData = {
      equipamento_id: equipamentoId,
      data: data.data.toISOString(),
      valor: data.valor,
      litragem: data.litragem,
      km_atual: data.km_atual,
      responsavel: data.responsavel,
      observacoes: data.observacoes,
    };

    await createAbastecimento.mutateAsync(abastecimentoData);
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Data do Abastecimento */}
      <div className="space-y-2">
        <Label htmlFor="data">Data do Abastecimento *</Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecione a data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setValue('data', date);
                  setDateOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.data && (
          <p className="text-sm text-red-600">{errors.data.message}</p>
        )}
      </div>

      {/* Valor e Litragem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$) *</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('valor', { valueAsNumber: true })}
          />
          {errors.valor && (
            <p className="text-sm text-red-600">{errors.valor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="litragem">Litragem *</Label>
          <Input
            id="litragem"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register('litragem', { valueAsNumber: true })}
          />
          {errors.litragem && (
            <p className="text-sm text-red-600">{errors.litragem.message}</p>
          )}
        </div>
      </div>

      {/* KM Atual */}
      <div className="space-y-2">
        <Label htmlFor="km_atual">KM Atual</Label>
        <Input
          id="km_atual"
          type="number"
          step="0.01"
          placeholder="KM do equipamento (opcional)"
          {...register('km_atual', { valueAsNumber: true })}
        />
        {errors.km_atual && (
          <p className="text-sm text-red-600">{errors.km_atual.message}</p>
        )}
      </div>

      {/* Responsável */}
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável</Label>
        <Input
          id="responsavel"
          placeholder="Nome do responsável pelo abastecimento"
          {...register('responsavel')}
        />
        {errors.responsavel && (
          <p className="text-sm text-red-600">{errors.responsavel.message}</p>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Observações adicionais sobre o abastecimento"
          rows={3}
          {...register('observacoes')}
        />
        {errors.observacoes && (
          <p className="text-sm text-red-600">{errors.observacoes.message}</p>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Registrar Abastecimento'}
        </Button>
      </div>
    </form>
  );
}
