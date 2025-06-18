
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCaminhao, useUpdateCaminhao } from '@/hooks/useCaminhaoMutations';
import type { Caminhao } from '@/types/database';

const caminhaoSchema = z.object({
  placa: z.string().min(1, 'Placa é obrigatória'),
  modelo: z.string().optional(),
  marca: z.string().optional(),
  ano: z.string().optional(),
  capacidade_m3: z.string().optional(),
  observacoes: z.string().optional(),
});

type CaminhaoFormData = z.infer<typeof caminhaoSchema>;

interface CaminhaoFormProps {
  caminhao?: Caminhao;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CaminhaoForm = ({ caminhao, onSuccess, onCancel }: CaminhaoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const createCaminhao = useCreateCaminhao();
  const updateCaminhao = useUpdateCaminhao();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaminhaoFormData>({
    resolver: zodResolver(caminhaoSchema),
    defaultValues: {
      placa: caminhao?.placa || '',
      modelo: caminhao?.modelo || '',
      marca: caminhao?.marca || '',
      ano: caminhao?.ano?.toString() || '',
      capacidade_m3: caminhao?.capacidade_m3?.toString() || '',
      observacoes: caminhao?.observacoes || '',
    },
  });

  const onSubmit = async (data: CaminhaoFormData) => {
    setIsLoading(true);
    try {
      const caminhaoData = {
        placa: data.placa,
        modelo: data.modelo || null,
        marca: data.marca || null,
        ano: data.ano ? parseInt(data.ano) : null,
        capacidade_m3: data.capacidade_m3 ? parseFloat(data.capacidade_m3) : null,
        observacoes: data.observacoes || null,
        ativo: true,
      };

      if (caminhao) {
        await updateCaminhao.mutateAsync({ id: caminhao.id, ...caminhaoData });
      } else {
        await createCaminhao.mutateAsync(caminhaoData);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar caminhão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {caminhao ? 'Editar Caminhão' : 'Novo Caminhão'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                {...register('placa')}
                placeholder="ABC-1234"
                className="uppercase"
              />
              {errors.placa && (
                <p className="text-sm text-destructive">{errors.placa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                {...register('modelo')}
                placeholder="Modelo do veículo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                {...register('marca')}
                placeholder="Marca do veículo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                {...register('ano')}
                placeholder="2020"
                min="1900"
                max="2030"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade_m3">Capacidade (m³)</Label>
              <Input
                id="capacidade_m3"
                type="number"
                step="0.1"
                {...register('capacidade_m3')}
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : caminhao ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
