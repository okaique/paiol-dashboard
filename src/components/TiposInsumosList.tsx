
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TipoInsumoDialog } from './TipoInsumoDialog';
import { useTiposInsumos } from '@/hooks/useTiposInsumos';
import { useTipoInsumoMutations } from '@/hooks/useTipoInsumoMutations';
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
import type { TipoInsumo } from '@/types/database';

const categoriaOptions = [
  { value: 'COMBUSTIVEL', label: 'Combustível' },
  { value: 'OLEO', label: 'Óleo' },
  { value: 'FILTRO', label: 'Filtro' },
  { value: 'LUBRIFICANTE', label: 'Lubrificante' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'OUTROS', label: 'Outros' },
];

export const TiposInsumosList = () => {
  const { data: tiposInsumos, isLoading } = useTiposInsumos();
  const { deleteTipoInsumo } = useTipoInsumoMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
  } = useListFilters();

  const filteredTiposInsumos = useMemo(() => {
    if (!tiposInsumos) return [];

    return tiposInsumos.filter((tipoInsumo) => {
      // Filtro de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesNome = tipoInsumo.nome.toLowerCase().includes(searchLower);
        const matchesUnidade = tipoInsumo.unidade_medida.toLowerCase().includes(searchLower);
        const matchesObs = tipoInsumo.observacoes?.toLowerCase().includes(searchLower);
        
        if (!matchesNome && !matchesUnidade && !matchesObs) {
          return false;
        }
      }

      // Filtro de categoria
      if (filters.categoria && tipoInsumo.categoria !== filters.categoria) {
        return false;
      }

      return true;
    });
  }, [tiposInsumos, filters]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTipoInsumo.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'COMBUSTIVEL': 'bg-red-100 text-red-800',
      'OLEO': 'bg-yellow-100 text-yellow-800',
      'FILTRO': 'bg-blue-100 text-blue-800',
      'LUBRIFICANTE': 'bg-green-100 text-green-800',
      'MANUTENCAO': 'bg-purple-100 text-purple-800',
      'OUTROS': 'bg-gray-100 text-gray-800',
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando tipos de insumos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-end gap-4 justify-between md:flex-row">
        <div className="flex-1 w-full">
          <CardTitle className="flex items-center gap-2">
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
              categoriaOptions={categoriaOptions}
              showCategoria={true}
              searchPlaceholder="Buscar por nome, unidade ou observações..."
            />
          </div>
        </div>
        <TipoInsumoDialog>
          <Button className="w-full md:w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Novo Tipo de Insumo
          </Button>
        </TipoInsumoDialog>
      </CardHeader>
      <CardContent>
        {!filteredTiposInsumos || filteredTiposInsumos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters 
              ? 'Nenhum tipo de insumo encontrado com os filtros aplicados'
              : 'Nenhum tipo de insumo cadastrado'
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTiposInsumos.map((tipoInsumo) => (
                <TableRow key={tipoInsumo.id}>
                  <TableCell className="font-medium">{tipoInsumo.nome}</TableCell>
                  <TableCell>
                    <Badge className={getCategoriaColor(tipoInsumo.categoria)}>
                      {tipoInsumo.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>{tipoInsumo.unidade_medida}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {tipoInsumo.observacoes || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TipoInsumoDialog tipoInsumo={tipoInsumo}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TipoInsumoDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Tipo de Insumo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{tipoInsumo.nome}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tipoInsumo.id)}
                              disabled={deletingId === tipoInsumo.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === tipoInsumo.id ? 'Excluindo...' : 'Excluir'}
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
