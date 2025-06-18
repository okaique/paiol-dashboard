
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Truck, Calendar, Gauge } from 'lucide-react';
import { useCaminhoes } from '@/hooks/useCaminhoes';
import { useDeleteCaminhao } from '@/hooks/useCaminhaoMutations';
import type { Caminhao } from '@/types/database';

interface CaminhoesListProps {
  onEdit: (caminhao: Caminhao) => void;
}

export const CaminhoesList = ({ onEdit }: CaminhoesListProps) => {
  const [selectedCaminhao, setSelectedCaminhao] = useState<Caminhao | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: caminhoes, isLoading, error } = useCaminhoes();
  const deleteCaminhao = useDeleteCaminhao();

  const handleDelete = async () => {
    if (selectedCaminhao) {
      await deleteCaminhao.mutateAsync(selectedCaminhao.id);
      setShowDeleteDialog(false);
      setSelectedCaminhao(null);
    }
  };

  const openDeleteDialog = (caminhao: Caminhao) => {
    setSelectedCaminhao(caminhao);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando caminhões...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-destructive">Erro ao carregar caminhões</div>
        <p className="text-sm text-muted-foreground mt-2">
          Tente recarregar a página
        </p>
      </div>
    );
  }

  if (!caminhoes || caminhoes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Truck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum caminhão cadastrado</h3>
          <p className="text-muted-foreground text-center">
            Comece cadastrando o primeiro caminhão clicando no botão "Novo Caminhão"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {caminhoes.map((caminhao) => (
          <Card key={caminhao.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {caminhao.placa}
                </CardTitle>
                <Badge variant="secondary">Ativo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {caminhao.marca && caminhao.modelo && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Veículo:</span>
                  <span className="ml-2">{caminhao.marca} {caminhao.modelo}</span>
                </div>
              )}
              
              {caminhao.ano && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{caminhao.ano}</span>
                </div>
              )}
              
              {caminhao.capacidade_m3 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4 mr-2" />
                  <span>{caminhao.capacidade_m3} m³</span>
                </div>
              )}
              
              {caminhao.observacoes && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Obs:</span>
                  <p className="mt-1 text-xs">{caminhao.observacoes}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(caminhao)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(caminhao)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o caminhão <strong>{selectedCaminhao?.placa}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
