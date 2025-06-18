
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaiolMutations } from '@/hooks/usePaiolMutations';
import { useBusinessValidations } from '@/hooks/useBusinessValidations';
import { ValidationErrors } from './ValidationErrors';
import type { Paiol } from '@/types/database';

interface PaiolFormProps {
  paiol?: Paiol;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaiolForm = ({ paiol, onSuccess, onCancel }: PaiolFormProps) => {
  const [nome, setNome] = useState(paiol?.nome || '');
  const [localizacao, setLocalizacao] = useState(paiol?.localizacao || '');
  const [observacoes, setObservacoes] = useState(paiol?.observacoes || '');
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const { createPaiol, updatePaiol } = usePaiolMutations();
  const { validatePaiol } = useBusinessValidations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    
    const data = {
      nome: nome.trim(),
      localizacao,
      observacoes: observacoes.trim() || undefined,
    };

    try {
      // Executar validações de negócio
      const businessErrors = validatePaiol({ ...data, id: paiol?.id });
      
      if (businessErrors.filter(e => e.type === 'error').length > 0) {
        setValidationErrors(businessErrors);
        return;
      }

      // Mostrar warnings mas permitir continuar
      if (businessErrors.filter(e => e.type === 'warning').length > 0) {
        setValidationErrors(businessErrors);
      }

      if (paiol) {
        await updatePaiol.mutateAsync({ id: paiol.id, data });
      } else {
        await createPaiol.mutateAsync(data);
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

  const isLoading = createPaiol.isPending || updatePaiol.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {paiol ? 'Editar Paiol' : 'Novo Paiol'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidationErrors errors={validationErrors} />
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Paiol *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Paiol 7"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização *</Label>
            <Select value={localizacao} onValueChange={setLocalizacao} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sede">Sede</SelectItem>
                <SelectItem value="Neném">Neném</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre o paiol..."
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
              {isLoading ? 'Salvando...' : (paiol ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
