
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmpresaMetanicaMutations } from '@/hooks/useEmpresaMetanicaMutations';
import { EmpresaMecanica } from '@/types/empresas-mecanicas';

interface EmpresaMetanicaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empresa?: EmpresaMecanica | null;
}

export const EmpresaMetanicaDialog = ({ isOpen, onClose, empresa }: EmpresaMetanicaDialogProps) => {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');

  const { createEmpresaMecanica, updateEmpresaMecanica } = useEmpresaMetanicaMutations();

  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome);
      setContato(empresa.contato || '');
    } else {
      setNome('');
      setContato('');
    }
  }, [empresa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    const data = { nome: nome.trim(), contato: contato.trim() || undefined };

    if (empresa) {
      updateEmpresaMecanica.mutate({ id: empresa.id, ...data });
    } else {
      createEmpresaMecanica.mutate(data);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {empresa ? 'Editar Empresa Mecânica' : 'Nova Empresa Mecânica'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div>
            <Label htmlFor="contato">Contato</Label>
            <Input
              id="contato"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
              placeholder="Telefone, email ou pessoa de contato"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {empresa ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
