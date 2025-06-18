
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useDragadores } from '@/hooks/useDragadores';
import { useAjudantes } from '@/hooks/useAjudantes';
import { useCreateDragagem } from '@/hooks/useDragagemMutations';
import { format } from 'date-fns';
import type { Paiol } from '@/types/database';
import { DragadorSelector } from './dragagem/DragadorSelector';
import { AjudanteSelector } from './dragagem/AjudanteSelector';
import { DragagemDates } from './dragagem/DragagemDates';
import { DragagemObservacoes } from './dragagem/DragagemObservacoes';
import { DragagemFormActions } from './dragagem/DragagemFormActions';

const dragagemSchema = z.object({
  dragador_id: z.string().min(1, 'Dragador é obrigatório'),
  ajudante_id: z.string().optional(),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().optional(),
  observacoes: z.string().optional(),
});

type DragagemFormData = z.infer<typeof dragagemSchema>;

interface DragagemFormProps {
  paiol: Paiol;
  onSuccess: () => void;
  onCancel: () => void;
}

export const DragagemForm = ({ paiol, onSuccess, onCancel }: DragagemFormProps) => {
  const { data: dragadores, isLoading: loadingDragadores } = useDragadores();
  const { data: ajudantes, isLoading: loadingAjudantes } = useAjudantes();
  const createDragagem = useCreateDragagem();

  const form = useForm<DragagemFormData>({
    resolver: zodResolver(dragagemSchema),
    defaultValues: {
      dragador_id: '',
      ajudante_id: '',
      data_inicio: format(new Date(), 'yyyy-MM-dd'),
      data_fim: '',
      observacoes: '',
    },
  });

  const onSubmit = async (data: DragagemFormData) => {
    try {
      // Tratar ajudante_id: se for string vazia ou "none", definir como null
      const ajudanteId = data.ajudante_id && data.ajudante_id !== '' && data.ajudante_id !== 'none' 
        ? data.ajudante_id 
        : null;

      await createDragagem.mutateAsync({
        paiol_id: paiol.id,
        dragador_id: data.dragador_id,
        ajudante_id: ajudanteId,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim || null,
        observacoes: data.observacoes,
      });
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar dragagem:', error);
    }
  };

  const isLoading = createDragagem.isPending || loadingDragadores || loadingAjudantes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Dragagem - {paiol.nome}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DragadorSelector 
              control={form.control} 
              dragadores={dragadores} 
              isLoading={isLoading} 
            />
            
            <AjudanteSelector 
              control={form.control} 
              ajudantes={ajudantes} 
              isLoading={isLoading} 
            />
            
            <DragagemDates 
              control={form.control} 
              watch={form.watch} 
              isLoading={isLoading} 
            />
            
            <DragagemObservacoes 
              control={form.control} 
              isLoading={isLoading} 
            />
            
            <DragagemFormActions 
              isLoading={isLoading} 
              onCancel={onCancel} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
