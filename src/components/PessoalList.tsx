
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash, Phone, MapPin } from 'lucide-react';
import { useDragadores } from '@/hooks/useDragadores';
import { useAjudantes } from '@/hooks/useAjudantes';
import { useDragadorMutations } from '@/hooks/useDragadorMutations';
import { useAjudanteMutations } from '@/hooks/useAjudanteMutations';
import type { Dragador, Ajudante } from '@/types/database';

interface PessoalListProps {
  type: 'dragador' | 'ajudante';
  onEditDragador?: (dragador: Dragador) => void;
  onEditAjudante?: (ajudante: Ajudante) => void;
}

export const PessoalList = ({ type, onEditDragador, onEditAjudante }: PessoalListProps) => {
  const { data: dragadores, isLoading: loadingDragadores, error: errorDragadores } = useDragadores();
  const { data: ajudantes, isLoading: loadingAjudantes, error: errorAjudantes } = useAjudantes();
  const { deleteDragador } = useDragadorMutations();
  const { deleteAjudante } = useAjudanteMutations();

  const isLoading = type === 'dragador' ? loadingDragadores : loadingAjudantes;
  const error = type === 'dragador' ? errorDragadores : errorAjudantes;
  const data = type === 'dragador' ? dragadores : ajudantes;

  const handleDelete = async (id: string) => {
    try {
      if (type === 'dragador') {
        await deleteDragador.mutateAsync(id);
      } else {
        await deleteAjudante.mutateAsync(id);
      }
    } catch (error) {
      console.error(`Erro ao deletar ${type}:`, error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            Carregando {type === 'dragador' ? 'dragadores' : 'ajudantes'}...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar {type === 'dragador' ? 'dragadores' : 'ajudantes'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Lista de {type === 'dragador' ? 'Dragadores' : 'Ajudantes'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Valor Diária</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((pessoa) => (
              <TableRow key={pessoa.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{pessoa.nome}</div>
                    {pessoa.endereco && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{pessoa.endereco}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {pessoa.telefone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{pessoa.telefone}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {pessoa.valor_diaria && (
                    <span className="font-medium">
                      R$ {pessoa.valor_diaria.toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(pessoa.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (type === 'dragador' && onEditDragador) {
                          onEditDragador(pessoa as Dragador);
                        } else if (type === 'ajudante' && onEditAjudante) {
                          onEditAjudante(pessoa as Ajudante);
                        }
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {type === 'dragador' ? 'o dragador' : 'o ajudante'} "{pessoa.nome}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pessoa.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum {type === 'dragador' ? 'dragador' : 'ajudante'} encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
