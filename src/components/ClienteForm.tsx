
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCliente, useUpdateCliente } from '@/hooks/useClienteMutations';
import { useBusinessValidations } from '@/hooks/useBusinessValidations';
import { ValidationErrors } from './ValidationErrors';
import type { Cliente } from '@/types/database';

const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf_cnpj: z.string().optional(),
  tipo_pessoa: z.enum(['FISICA', 'JURIDICA']),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  cliente?: Cliente;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClienteForm = ({ cliente, onSuccess, onCancel }: ClienteFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();
  const { validateCliente } = useBusinessValidations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: cliente?.nome || '',
      cpf_cnpj: cliente?.cpf_cnpj || '',
      tipo_pessoa: cliente?.tipo_pessoa || 'FISICA',
      telefone: cliente?.telefone || '',
      email: cliente?.email || '',
      endereco: cliente?.endereco || '',
      observacoes: cliente?.observacoes || '',
    },
  });

  const tipoPessoa = watch('tipo_pessoa');

  const onSubmit = async (data: ClienteFormData) => {
    setIsLoading(true);
    setValidationErrors([]);
    
    try {
      // Executar validações de negócio
      const businessErrors = validateCliente({ ...data, id: cliente?.id });
      
      if (businessErrors.filter(e => e.type === 'error').length > 0) {
        setValidationErrors(businessErrors);
        setIsLoading(false);
        return;
      }

      // Mostrar warnings mas permitir continuar
      if (businessErrors.filter(e => e.type === 'warning').length > 0) {
        setValidationErrors(businessErrors);
      }

      const clienteData = {
        nome: data.nome,
        tipo_pessoa: data.tipo_pessoa,
        cpf_cnpj: data.cpf_cnpj || null,
        telefone: data.telefone || null,
        email: data.email || null,
        endereco: data.endereco || null,
        observacoes: data.observacoes || null,
        ativo: true,
      };

      if (cliente) {
        await updateCliente.mutateAsync({ id: cliente.id, ...clienteData });
      } else {
        await createCliente.mutateAsync(clienteData);
      }

      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setValidationErrors([{ 
        message: 'Erro interno do servidor. Tente novamente.', 
        type: 'error' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {cliente ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ValidationErrors errors={validationErrors} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Nome do cliente"
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_pessoa">Tipo de Pessoa</Label>
              <Select
                value={tipoPessoa}
                onValueChange={(value: 'FISICA' | 'JURIDICA') => setValue('tipo_pessoa', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FISICA">Pessoa Física</SelectItem>
                  <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">
                {tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
              </Label>
              <Input
                id="cpf_cnpj"
                {...register('cpf_cnpj')}
                placeholder={tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="Telefone de contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Email de contato"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              {...register('endereco')}
              placeholder="Endereço completo"
            />
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
              {isLoading ? 'Salvando...' : cliente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
