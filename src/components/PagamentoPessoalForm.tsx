
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePagamentoPessoalMutations } from '@/hooks/usePagamentosPessoalMutations';
import type { PagamentoPessoal, TipoPagamento } from '@/types/database';

const formSchema = z.object({
  pessoa_id: z.string().min(1, 'Selecione uma pessoa'),
  tipo_pessoa: z.enum(['DRAGADOR', 'AJUDANTE']),
  tipo_pagamento: z.enum(['ADIANTAMENTO', 'PAGAMENTO_FINAL']),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data_pagamento: z.string().min(1, 'Data é obrigatória'),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PagamentoPessoalFormProps {
  dragagemId: string;
  dragadorId: string;
  dragadorNome: string;
  ajudanteId?: string;
  ajudanteNome?: string;
  pagamento?: PagamentoPessoal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PagamentoPessoalForm = ({
  dragagemId,
  dragadorId,
  dragadorNome,
  ajudanteId,
  ajudanteNome,
  pagamento,
  onSuccess,
  onCancel,
}: PagamentoPessoalFormProps) => {
  const { createPagamentoPessoal, updatePagamentoPessoal } = usePagamentoPessoalMutations();
  const [selectedPessoa, setSelectedPessoa] = useState<string>(pagamento?.pessoa_id || '');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_id: pagamento?.pessoa_id || '',
      tipo_pessoa: pagamento?.tipo_pessoa || 'DRAGADOR',
      tipo_pagamento: (pagamento?.tipo_pagamento as TipoPagamento) || 'ADIANTAMENTO',
      valor: pagamento?.valor || 0,
      data_pagamento: pagamento?.data_pagamento 
        ? new Date(pagamento.data_pagamento).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      observacoes: pagamento?.observacoes || '',
    },
  });

  const isLoading = createPagamentoPessoal.isPending || updatePagamentoPessoal.isPending;

  const onSubmit = async (data: FormData) => {
    const pessoaSelecionada = data.pessoa_id === dragadorId ? 'DRAGADOR' : 'AJUDANTE';
    
    const submitData = {
      dragagem_id: dragagemId,
      pessoa_id: data.pessoa_id,
      tipo_pessoa: pessoaSelecionada as 'DRAGADOR' | 'AJUDANTE',
      tipo_pagamento: data.tipo_pagamento,
      valor: data.valor,
      data_pagamento: new Date(data.data_pagamento).toISOString(),
      observacoes: data.observacoes,
    };

    try {
      if (pagamento) {
        await updatePagamentoPessoal.mutateAsync({
          id: pagamento.id,
          ...submitData,
        });
      } else {
        await createPagamentoPessoal.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
    }
  };

  const pessoasDisponiveis = [
    { id: dragadorId, nome: dragadorNome, tipo: 'DRAGADOR' },
    ...(ajudanteId && ajudanteNome ? [{ id: ajudanteId, nome: ajudanteNome, tipo: 'AJUDANTE' }] : []),
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pessoa_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pessoa</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedPessoa(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pessoa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pessoasDisponiveis.map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADIANTAMENTO">Adiantamento</SelectItem>
                  <SelectItem value="PAGAMENTO_FINAL">Pagamento Final</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do Pagamento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o pagamento..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {isLoading ? 'Salvando...' : pagamento ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
