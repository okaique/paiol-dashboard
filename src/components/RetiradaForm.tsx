
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ClienteSelect } from './retirada/ClienteSelect';
import { VolumeInput } from './retirada/VolumeInput';
import { VolumeInfoCard } from './retirada/VolumeInfoCard';
import { MotoristaFields } from './retirada/MotoristaFields';
import { ValorFields } from './retirada/ValorFields';
import { FreteFields } from './retirada/FreteFields';
import { useVolumeControl } from '@/hooks/useVolumeControl';
import { useDragagemMaisRecente } from '@/hooks/useDragagens';
import type { Retirada } from '@/types/database';
import { format } from 'date-fns';

const retiradaSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente é obrigatório'),
  data_retirada: z.string().min(1, 'Data/hora é obrigatória'),
  volume_retirado: z.number().min(0.01, 'Volume deve ser maior que zero'),
  valor_unitario: z.number().min(0).optional(),
  motorista_nome: z.string().optional(),
  motorista_cpf: z.string().optional(),
  placa_informada: z.string().optional(),
  tem_frete: z.boolean().default(false),
  valor_frete: z.number().min(0).optional().nullable(),
  caminhao_frete_id: z.string().optional().nullable(),
  status_pagamento: z.enum(['PAGO', 'NAO_PAGO']).default('NAO_PAGO'),
  observacoes: z.string().optional(),
}).refine((data) => {
  // Se tem frete, valor_frete é obrigatório
  if (data.tem_frete) {
    return data.valor_frete !== undefined && data.valor_frete !== null && data.valor_frete > 0;
  }
  return true;
}, {
  message: "Valor do frete é obrigatório quando 'Tem Frete' está marcado",
  path: ["valor_frete"],
});

type RetiradaFormData = z.infer<typeof retiradaSchema>;

interface RetiradaFormProps {
  paiolId: string;
  retirada?: Retirada;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const RetiradaForm = ({
  paiolId,
  retirada,
  onSubmit,
  onCancel,
  isLoading,
}: RetiradaFormProps) => {
  const [volumeError, setVolumeError] = useState<string>('');
  
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiolId);
  const volumeControl = useVolumeControl(paiolId, dragagemMaisRecente?.id);

  const form = useForm<RetiradaFormData>({
    resolver: zodResolver(retiradaSchema),
    defaultValues: {
      cliente_id: retirada?.cliente_id || '',
      data_retirada: retirada?.data_retirada 
        ? format(new Date(retirada.data_retirada), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      volume_retirado: retirada?.volume_retirado || 0,
      valor_unitario: retirada?.valor_unitario || undefined,
      motorista_nome: retirada?.motorista_nome || '',
      motorista_cpf: retirada?.motorista_cpf || '',
      placa_informada: retirada?.placa_informada || '',
      tem_frete: retirada?.tem_frete || false,
      valor_frete: retirada?.valor_frete || null,
      caminhao_frete_id: retirada?.caminhao_frete_id || '',
      status_pagamento: retirada?.status_pagamento || 'NAO_PAGO',
      observacoes: retirada?.observacoes || '',
    },
  });

  const watchedValues = form.watch();

  // Calcular valor total automaticamente
  useEffect(() => {
    const volumeRetirado = watchedValues.volume_retirado || 0;
    const valorUnitario = watchedValues.valor_unitario || 0;
    
    if (volumeRetirado > 0 && valorUnitario > 0) {
      // O valor total será calculado no backend pelo trigger
      console.log('Calculando valor total:', { volumeRetirado, valorUnitario, total: volumeRetirado * valorUnitario });
    }
  }, [watchedValues.volume_retirado, watchedValues.valor_unitario]);

  const handleSubmit = async (data: RetiradaFormData) => {
    console.log('Dados do formulário antes da submissão:', data);
    
    // Limpar erros anteriores
    setVolumeError('');

    // Validar volume positivo
    if (data.volume_retirado <= 0) {
      setVolumeError('Volume deve ser maior que zero');
      return;
    }

    try {
      // Converter a data para ISO string mantendo o horário local
      const dataRetirada = new Date(data.data_retirada).toISOString();
      
      // Preparar dados para submissão
      const submitData = {
        ...data,
        paiol_id: paiolId,
        data_retirada: dataRetirada,
        valor_total: (data.volume_retirado || 0) * (data.valor_unitario || 0),
        data_pagamento: data.status_pagamento === 'PAGO' ? new Date().toISOString() : null,
        // Garantir que campos de frete sejam null quando não há frete
        valor_frete: data.tem_frete ? data.valor_frete : null,
        caminhao_frete_id: data.tem_frete ? data.caminhao_frete_id : null,
      };

      console.log('Dados preparados para submissão:', submitData);
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao submeter retirada:', error);
    }
  };

  return (
    <div className="space-y-6">
      <VolumeInfoCard
        volumeTotal={volumeControl.volumeTotal}
        volumeRetirado={volumeControl.volumeRetirado}
        volumeDisponivel={volumeControl.volumeDisponivel}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Cliente */}
          <FormField
            control={form.control}
            name="cliente_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <FormControl>
                  <ClienteSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data e Hora */}
          <FormField
            control={form.control}
            name="data_retirada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora da Retirada *</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Volume */}
          <FormField
            control={form.control}
            name="volume_retirado"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VolumeInput
                    value={field.value}
                    onChange={field.onChange}
                    volumeError={volumeError}
                    fieldError={form.formState.errors.volume_retirado?.message}
                    volumeDisponivel={volumeControl.volumeDisponivel}
                    volumeTotal={volumeControl.volumeTotal}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Campos de Valor */}
          <ValorFields form={form} />

          {/* Campos do Motorista */}
          <MotoristaFields form={form} />

          {/* Sistema de Frete */}
          <FreteFields form={form} />

          {/* Status de Pagamento */}
          <FormField
            control={form.control}
            name="status_pagamento"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value === 'PAGO'}
                    onCheckedChange={(checked) => 
                      field.onChange(checked ? 'PAGO' : 'NAO_PAGO')
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marcar como pago</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Observações */}
          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações adicionais sobre a retirada..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : retirada ? 'Atualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
