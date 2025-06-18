
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEquipamentoMutations } from '@/hooks/useEquipamentoMutations';
import { Equipamento } from '@/types/database';

const equipamentoSchema = z.object({
  modelo: z.string().min(1, "Modelo é obrigatório"),
  placa: z.string().optional(),
});

type EquipamentoFormData = z.infer<typeof equipamentoSchema>;

interface EquipamentoFormProps {
  equipamento?: Equipamento;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipamentoForm({ equipamento, isOpen, onClose }: EquipamentoFormProps) {
  const { createEquipamento, updateEquipamento } = useEquipamentoMutations();
  const isEditing = !!equipamento;

  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: {
      modelo: equipamento?.modelo || '',
      placa: equipamento?.placa || '',
    },
  });

  const onSubmit = async (data: EquipamentoFormData) => {
    try {
      if (isEditing) {
        await updateEquipamento.mutateAsync({
          id: equipamento.id,
          modelo: data.modelo,
          placa: data.placa || undefined,
        });
      } else {
        await createEquipamento.mutateAsync({
          modelo: data.modelo,
          placa: data.placa || undefined,
          ativo: true,
        });
      }
      
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o modelo do equipamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a placa (se aplicável)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createEquipamento.isPending || updateEquipamento.isPending}
              >
                {createEquipamento.isPending || updateEquipamento.isPending 
                  ? 'Salvando...' 
                  : isEditing ? 'Atualizar' : 'Cadastrar'
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
