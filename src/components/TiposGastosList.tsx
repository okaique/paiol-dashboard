
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TipoGastoDialog } from './TipoGastoDialog';
import { useTiposGastos } from '@/hooks/useTiposGastos';
import { useTipoGastoMutations } from '@/hooks/useTipoGastoMutations';
import { useListFilters } from '@/hooks/useListFilters';
import { ListFilters } from './ListFilters';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { TipoGasto } from '@/types/database';

export const TiposGastosList = () => {
  const { data: tiposGastos, isLoading } = useTiposGastos();
  const { deleteTipoGasto } = useTipoGastoMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
  } = useListFilters();

  const filteredTiposGastos = useMemo(() => {
    if (!tiposGastos) return [];

    return tiposGastos.filter((tipoGasto) => {
      // Filtro de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesNome = tipoGasto.nome.toLowerCase().includes(searchLower);
        
        if (!matchesNome) {
          return false;
        }
      }

      return true;
    });
  }, [tiposGastos, filters]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTipoGasto.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando tipos de gastos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            Tipos de Gastos
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Filtrado
              </Badge>
            )}
          </CardTitle>
          
          <div className="mt-4">
            <ListFilters
              filters={filters}
              showFilters={showFilters}
              hasActiveFilters={hasActiveFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onUpdateFilter={updateFilter}
              onClearFilters={clearFilters}
              onQuickDateFilter={() => {}}
              searchPlaceholder="Buscar por nome..."
            />
          </div>
        </div>
        <TipoGastoDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Tipo de Gasto
          </Button>
        </TipoGastoDialog>
      </CardHeader>
      <CardContent>
        {!filteredTiposGastos || filteredTiposGastos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters 
              ? 'Nenhum tipo de gasto encontrado com os filtros aplicados'
              : 'Nenhum tipo de gasto cadastrado'
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTiposGastos.map((tipoGasto) => (
                <TableRow key={tipoGasto.id}>
                  <TableCell className="font-medium">{tipoGasto.nome}</TableCell>
                  <TableCell>
                    <Badge variant={tipoGasto.ativo ? "default" : "secondary"}>
                      {tipoGasto.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TipoGastoDialog tipoGasto={tipoGasto}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TipoGastoDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Tipo de Gasto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{tipoGasto.nome}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tipoGasto.id)}
                              disabled={deletingId === tipoGasto.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === tipoGasto.id ? 'Excluindo...' : 'Excluir'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
