
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDragadorMutations } from '@/hooks/useDragadorMutations';
import type { Dragador } from '@/types/database';

interface DragadorFormProps {
  dragador?: Dragador;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DragadorForm = ({ dragador, onSuccess, onCancel }: DragadorFormProps) => {
  const [nome, setNome] = useState(dragador?.nome || '');
  const [cpf, setCpf] = useState(dragador?.cpf || '');
  const [telefone, setTelefone] = useState(dragador?.telefone || '');
  const [endereco, setEndereco] = useState(dragador?.endereco || '');
  const [valorDiaria, setValorDiaria] = useState(dragador?.valor_diaria?.toString() || '');
  const [observacoes, setObservacoes] = useState(dragador?.observacoes || '');

  const { createDragador, updateDragador } = useDragadorMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: nome.trim(),
      cpf: cpf.trim() || undefined,
      telefone: telefone.trim() || undefined,
      endereco: endereco.trim() || undefined,
      valor_diaria: valorDiaria ? parseFloat(valorDiaria) : undefined,
      observacoes: observacoes.trim() || undefined,
    };

    if (!data.nome) {
      return;
    }

    try {
      if (dragador) {
        await updateDragador.mutateAsync({ id: dragador.id, data });
      } else {
        await createDragador.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  const isLoading = createDragador.isPending || updateDragador.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {dragador ? 'Editar Dragador' : 'Novo Dragador'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do dragador"
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
              placeholder="Observações sobre o dragador..."
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
              {isLoading ? 'Salvando...' : (dragador ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
