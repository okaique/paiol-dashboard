
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTipoManutencaoMutations } from '@/hooks/useTipoManutencaoMutations';
import { TipoManutencao } from '@/types/tipos-manutencao';

interface TipoManutencaoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tipo?: TipoManutencao | null;
}

export const TipoManutencaoDialog = ({ isOpen, onClose, tipo }: TipoManutencaoDialogProps) => {
  const [nome, setNome] = useState('');

  const { createTipoManutencao, updateTipoManutencao } = useTipoManutencaoMutations();

  useEffect(() => {
    if (tipo) {
      setNome(tipo.nome);
    } else {
      setNome('');
    }
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    const data = { nome: nome.trim() };

    if (tipo) {
      updateTipoManutencao.mutate({ id: tipo.id, ...data });
    } else {
      createTipoManutencao.mutate(data);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tipo ? 'Editar Tipo de Manutenção' : 'Novo Tipo de Manutenção'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do tipo de manutenção"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {tipo ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
