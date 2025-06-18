
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CreateManutencaoData } from '@/hooks/useManutencaoMutations';
import { useManutencaoMutations } from '@/hooks/useManutencaoMutations';
import { useEmpresasMetanicas } from '@/hooks/useEmpresasMetanicas';
import { useTiposManutencao } from '@/hooks/useTiposManutencao';

const manutencaoSchema = z.object({
  data: z.date(),
  empresa_id: z.string().min(1, 'Empresa é obrigatória'),
  tipo_id: z.string().min(1, 'Tipo é obrigatório'),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  responsavel: z.string().optional(),
  observacoes: z.string().optional(),
});

type ManutencaoFormData = z.infer<typeof manutencaoSchema>;

interface ManutencaoFormProps {
  equipamentoId: string;
  onSuccess?: () => void;
}

export function ManutencaoForm({ equipamentoId, onSuccess }: ManutencaoFormProps) {
  const { createManutencao } = useManutencaoMutations();
  const { data: empresas } = useEmpresasMetanicas();
  const { data: tipos } = useTiposManutencao();
  const [dateOpen, setDateOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ManutencaoFormData>({
    resolver: zodResolver(manutencaoSchema),
    defaultValues: {
      data: new Date(),
    },
  });

  const selectedDate = watch('data');
  const selectedEmpresa = watch('empresa_id');
  const selectedTipo = watch('tipo_id');

  const onSubmit = async (data: ManutencaoFormData) => {
    const manutencaoData: CreateManutencaoData = {
      equipamento_id: equipamentoId,
      data: data.data.toISOString(),
      empresa_id: data.empresa_id,
      tipo_id: data.tipo_id,
      valor: data.valor,
      responsavel: data.responsavel,
      observacoes: data.observacoes,
    };

    await createManutencao.mutateAsync(manutencaoData);
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Data da Manutenção */}
      <div className="space-y-2">
        <Label htmlFor="data">Data da Manutenção *</Label>
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

      {/* Empresa e Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="empresa_id">Empresa *</Label>
          <Select value={selectedEmpresa} onValueChange={(value) => setValue('empresa_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas?.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.empresa_id && (
            <p className="text-sm text-red-600">{errors.empresa_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_id">Tipo *</Label>
          <Select value={selectedTipo} onValueChange={(value) => setValue('tipo_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos?.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo_id && (
            <p className="text-sm text-red-600">{errors.tipo_id.message}</p>
          )}
        </div>
      </div>

      {/* Valor */}
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

      {/* Responsável */}
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável</Label>
        <Input
          id="responsavel"
          placeholder="Nome do responsável pela manutenção"
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
          placeholder="Observações adicionais sobre a manutenção"
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
          {isSubmitting ? 'Salvando...' : 'Registrar Manutenção'}
        </Button>
      </div>
    </form>
  );
}
