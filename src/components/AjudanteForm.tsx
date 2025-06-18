
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAjudanteMutations } from '@/hooks/useAjudanteMutations';
import { useBusinessValidations } from '@/hooks/useBusinessValidations';
import { ValidationErrors } from './ValidationErrors';
import type { Ajudante } from '@/types/database';

interface AjudanteFormProps {
  ajudante?: Ajudante;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AjudanteForm = ({ ajudante, onSuccess, onCancel }: AjudanteFormProps) => {
  const [nome, setNome] = useState(ajudante?.nome || '');
  const [cpf, setCpf] = useState(ajudante?.cpf || '');
  const [telefone, setTelefone] = useState(ajudante?.telefone || '');
  const [endereco, setEndereco] = useState(ajudante?.endereco || '');
  const [valorDiaria, setValorDiaria] = useState(ajudante?.valor_diaria?.toString() || '');
  const [observacoes, setObservacoes] = useState(ajudante?.observacoes || '');
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const { createAjudante, updateAjudante } = useAjudanteMutations();
  const { validatePessoa } = useBusinessValidations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    
    const data = {
      nome: nome.trim(),
      cpf: cpf.trim() || undefined,
      telefone: telefone.trim() || undefined,
      endereco: endereco.trim() || undefined,
      valor_diaria: valorDiaria ? parseFloat(valorDiaria) : undefined,
      observacoes: observacoes.trim() || undefined,
    };

    try {
      // Executar validações de negócio
      const businessErrors = validatePessoa({ ...data, id: ajudante?.id }, 'ajudante');
      
      if (businessErrors.filter(e => e.type === 'error').length > 0) {
        setValidationErrors(businessErrors);
        return;
      }

      // Mostrar warnings mas permitir continuar
      if (businessErrors.filter(e => e.type === 'warning').length > 0) {
        setValidationErrors(businessErrors);
      }

      if (ajudante) {
        await updateAjudante.mutateAsync({ id: ajudante.id, data });
      } else {
        await createAjudante.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro no formulário:', error);
      setValidationErrors([{ 
        message: 'Erro interno do servidor. Tente novamente.', 
        type: 'error' 
      }]);
    }
  };

  const isLoading = createAjudante.isPending || updateAjudante.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {ajudante ? 'Editar Ajudante' : 'Novo Ajudante'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidationErrors errors={validationErrors} />
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do ajudante"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorDiaria">Valor da Diária (R$)</Label>
            <Input
              id="valorDiaria"
              type="number"
              step="0.01"
              value={valorDiaria}
              onChange={(e) => setValorDiaria(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre o ajudante..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (ajudante ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
