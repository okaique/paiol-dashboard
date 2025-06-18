
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useCreateGastoInsumo } from '@/hooks/useGastosInsumos';
import { format } from 'date-fns';
import { TipoInsumoSelector } from './gasto-insumo/TipoInsumoSelector';
import { QuantidadeValorFields } from './gasto-insumo/QuantidadeValorFields';
import { DataFornecedorFields } from './gasto-insumo/DataFornecedorFields';
import { ObservacoesField } from './gasto-insumo/ObservacoesField';
import { GastoFormActions } from './gasto-insumo/GastoFormActions';

const gastoInsumoSchema = z.object({
  tipo_insumo_id: z.string().min(1, 'Tipo de insumo é obrigatório'),
  quantidade: z.number().min(0.001, 'Quantidade deve ser maior que zero'),
  valor_unitario: z.number().min(0.01, 'Valor unitário deve ser maior que zero'),
  data_gasto: z.string().min(1, 'Data do gasto é obrigatória'),
  fornecedor: z.string().optional(),
  observacoes: z.string().optional(),
});

type GastoInsumoFormData = z.infer<typeof gastoInsumoSchema>;

interface GastoInsumoFormProps {
  dragagemId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const GastoInsumoForm = ({ dragagemId, onSuccess, onCancel }: GastoInsumoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createGastoInsumo = useCreateGastoInsumo();

  const form = useForm<GastoInsumoFormData>({
    resolver: zodResolver(gastoInsumoSchema),
    defaultValues: {
      tipo_insumo_id: '',
      quantidade: 0,
      valor_unitario: 0,
      data_gasto: format(new Date(), 'yyyy-MM-dd'),
      fornecedor: '',
      observacoes: '',
    },
  });

  const onSubmit = async (data: GastoInsumoFormData) => {
    setIsSubmitting(true);
    
    try {
      await createGastoInsumo.mutateAsync({
        dragagem_id: dragagemId,
        tipo_insumo_id: data.tipo_insumo_id,
        quantidade: data.quantidade,
        valor_unitario: data.valor_unitario,
        valor_total: data.quantidade * data.valor_unitario,
        data_gasto: data.data_gasto,
        fornecedor: data.fornecedor || null,
        observacoes: data.observacoes || null,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar gasto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TipoInsumoSelector control={form.control} />
        <QuantidadeValorFields control={form.control} />
        <DataFornecedorFields control={form.control} />
        <ObservacoesField control={form.control} />
        <GastoFormActions isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
};
