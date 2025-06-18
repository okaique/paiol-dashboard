
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCubagem } from '@/hooks/useCubagemMutations';
import { VolumeCalculation } from './VolumeCalculation';
import { Loader2, Calculator } from 'lucide-react';
import { format } from 'date-fns';

const cubagemSchema = z.object({
  medida_inferior: z.string().min(1, 'Medida inferior é obrigatória')
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Deve ser um número positivo'),
  medida_superior: z.string().min(1, 'Medida superior é obrigatória')
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Deve ser um número positivo'),
  perimetro: z.string().min(1, 'Perímetro é obrigatório')
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Deve ser um número positivo'),
  volume_reduzido: z.string().min(1, 'Volume reduzido é obrigatório')
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, 'Deve ser um número positivo'),
  data_cubagem: z.string().optional(),
  observacoes: z.string().optional(),
});

type CubagemFormData = z.infer<typeof cubagemSchema>;

interface CubagemFormProps {
  paiolId: string;
  dragagemId: string;
  paiolNome: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CubagemForm = ({ paiolId, dragagemId, paiolNome, onSuccess, onCancel }: CubagemFormProps) => {
  const [calculationValues, setCalculationValues] = useState<{
    medidaInferior: number;
    medidaSuperior: number;
    perimetro: number;
  } | null>(null);
  
  const createCubagem = useCreateCubagem();

  const form = useForm<CubagemFormData>({
    resolver: zodResolver(cubagemSchema),
    defaultValues: {
      medida_inferior: '' as any,
      medida_superior: '' as any,
      perimetro: '' as any,
      volume_reduzido: '' as any,
      data_cubagem: format(new Date(), 'yyyy-MM-dd'),
      observacoes: '',
    },
  });

  const watchedValues = form.watch(['medida_inferior', 'medida_superior', 'perimetro']);

  // Atualizar valores para cálculo em tempo real
  useEffect(() => {
    const [inferior, superior, perimetro] = watchedValues;
    
    if (inferior && superior && perimetro) {
      const medidaInf = typeof inferior === 'string' ? parseFloat(inferior) : inferior;
      const medidaSup = typeof superior === 'string' ? parseFloat(superior) : superior;
      const per = typeof perimetro === 'string' ? parseFloat(perimetro) : perimetro;
      
      if (!isNaN(medidaInf) && !isNaN(medidaSup) && !isNaN(per) && 
          medidaInf > 0 && medidaSup > 0 && per > 0) {
        setCalculationValues({
          medidaInferior: medidaInf,
          medidaSuperior: medidaSup,
          perimetro: per,
        });
      } else {
        setCalculationValues(null);
      }
    } else {
      setCalculationValues(null);
    }
  }, [watchedValues]);

  const onSubmit = async (data: CubagemFormData) => {
    try {
      await createCubagem.mutateAsync({
        paiol_id: paiolId,
        dragagem_id: dragagemId,
        medida_inferior: data.medida_inferior,
        medida_superior: data.medida_superior,
        perimetro: data.perimetro,
        volume_reduzido: data.volume_reduzido,
        data_cubagem: data.data_cubagem || undefined,
        observacoes: data.observacoes || undefined,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao registrar cubagem:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Registro de Cubagem</h3>
        <p className="text-sm text-muted-foreground">
          Paiol: <span className="font-medium">{paiolNome}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="medida_inferior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medida Inferior (m³)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medida_superior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medida Superior (m³)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perimetro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perímetro (m)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Componente de cálculo de volume */}
          {calculationValues && (
            <VolumeCalculation
              medidaInferior={calculationValues.medidaInferior}
              medidaSuperior={calculationValues.medidaSuperior}
              perimetro={calculationValues.perimetro}
              showFormula={true}
            />
          )}

          <FormField
            control={form.control}
            name="volume_reduzido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Reduzido (m³) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.001"
                    placeholder="Digite o volume já calculado"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Este será o volume disponível para retiradas
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_cubagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Cubagem</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
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
                    {...field}
                    placeholder="Observações sobre a cubagem..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={createCubagem.isPending}
              className="flex-1"
            >
              {createCubagem.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Registrar Cubagem
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={createCubagem.isPending}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
