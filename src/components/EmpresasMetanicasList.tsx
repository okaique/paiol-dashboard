
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useEmpresasMetanicas } from '@/hooks/useEmpresasMetanicas';
import { useEmpresaMetanicaMutations } from '@/hooks/useEmpresaMetanicaMutations';
import { EmpresaMetanicaDialog } from './EmpresaMetanicaDialog';
import { EmpresaMecanica } from '@/types/empresas-mecanicas';

export const EmpresasMetanicasList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<EmpresaMecanica | null>(null);

  const { data: empresas = [], isLoading } = useEmpresasMetanicas();
  const { deleteEmpresaMecanica } = useEmpresaMetanicaMutations();

  const handleEdit = (empresa: EmpresaMecanica) => {
    setEditingEmpresa(empresa);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja desativar esta empresa mecânica?')) {
      deleteEmpresaMecanica.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmpresa(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando empresas mecânicas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setIsDialogOpen(true)} className="w-full self-end sm:w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {empresas.map((empresa) => (
          <Card key={empresa.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{empresa.nome}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(empresa)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {empresa.contato && (
                <p className="text-sm text-muted-foreground">
                  Contato: {empresa.contato}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Status: {empresa.ativo ? 'Ativo' : 'Inativo'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {empresas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma empresa mecânica cadastrada
        </div>
      )}

      <EmpresaMetanicaDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        empresa={editingEmpresa}
      />
    </div>
  );
};