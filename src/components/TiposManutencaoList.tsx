
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTiposManutencao } from '@/hooks/useTiposManutencao';
import { useTipoManutencaoMutations } from '@/hooks/useTipoManutencaoMutations';
import { TipoManutencaoDialog } from './TipoManutencaoDialog';
import { TipoManutencao } from '@/types/tipos-manutencao';

export const TiposManutencaoList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoManutencao | null>(null);

  const { data: tipos = [], isLoading } = useTiposManutencao();
  const { deleteTipoManutencao } = useTipoManutencaoMutations();

  const handleEdit = (tipo: TipoManutencao) => {
    setEditingTipo(tipo);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja desativar este tipo de manutenção?')) {
      deleteTipoManutencao.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTipo(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando tipos de manutenção...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setIsDialogOpen(true)} className="w-full self-end sm:w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tipos.map((tipo) => (
          <Card key={tipo.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{tipo.nome}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tipo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tipo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Status: {tipo.ativo ? 'Ativo' : 'Inativo'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {tipos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum tipo de manutenção cadastrado
        </div>
      )}

      <TipoManutencaoDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        tipo={editingTipo}
      />
    </div>
  );
};