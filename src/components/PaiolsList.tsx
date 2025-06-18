import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash, MapPin, Calendar } from 'lucide-react';
import { usePaiols } from '@/hooks/usePaiols';
import { usePaiolMutations } from '@/hooks/usePaiolMutations';
import { useListFilters } from '@/hooks/useListFilters';
import { ListFilters } from './ListFilters';
import { useMemo } from 'react';
import type { Paiol } from '@/types/database';

interface PaiolsListProps {
  onEdit?: (paiol: Paiol) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'VAZIO':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'DRAGANDO':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CHEIO':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'RETIRANDO':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'VAZIO':
      return 'Vazio';
    case 'DRAGANDO':
      return 'Dragagem em andamento';
    case 'CHEIO':
      return 'Cheio';
    case 'RETIRANDO':
      return 'Retirando';
    default:
      return status;
  }
};

const statusOptions = [
  { value: 'VAZIO', label: 'Vazio' },
  { value: 'DRAGANDO', label: 'Dragagem em andamento' },
  { value: 'CHEIO', label: 'Cheio' },
  { value: 'RETIRANDO', label: 'Retirando' },
];

export const PaiolsList = ({ onEdit }: PaiolsListProps) => {
  const { data: paiols, isLoading, error, refetch } = usePaiols();
  const { deletePaiol } = usePaiolMutations();

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
    setQuickDateFilter,
  } = useListFilters();

  console.log('PaiolsList - Paióis carregados:', paiols);

  const filteredPaiols = useMemo(() => {
    if (!paiols) return [];

    return paiols.filter((paiol) => {
      // Use status_real if available
      const currentStatus = (paiol as any).status_real || paiol.status;

      // Filtro de busca
      if (filters.searchTerm && !paiol.nome.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !paiol.localizacao.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro de status - usar o status real
      if (filters.status && currentStatus !== filters.status) {
        return false;
      }

      // Filtro de data
      if (filters.dateFrom) {
        const paiolDate = new Date(paiol.created_at).toISOString().split('T')[0];
        if (paiolDate < filters.dateFrom) {
          return false;
        }
      }

      if (filters.dateTo) {
        const paiolDate = new Date(paiol.created_at).toISOString().split('T')[0];
        if (paiolDate > filters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [paiols, filters]);

  const handleDelete = async (id: string) => {
    try {
      await deletePaiol.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao deletar paiol:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando paióis...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar paióis
            <Button variant="outline" onClick={() => refetch()} className="ml-2">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>

        <ListFilters
          filters={filters}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          onQuickDateFilter={setQuickDateFilter}
          statusOptions={statusOptions}
          showStatus={true}
          showDateFilters={true}
          searchPlaceholder="Buscar por nome ou localização..."
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiols?.map((paiol) => {
              const currentStatus = (paiol as any).status_real || paiol.status;

              return (
                <TableRow key={paiol.id}>
                  <TableCell className="font-medium">{paiol.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{paiol.localizacao}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(currentStatus)}>
                      {getStatusText(currentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>{paiol.ciclo_atual}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(paiol.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(paiol)}
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
                              Tem certeza que deseja remover o paiol "{paiol.nome}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(paiol.id)}
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
              );
            })}
            {filteredPaiols?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {hasActiveFilters ? 'Nenhum paiol encontrado com os filtros aplicados' : 'Nenhum paiol encontrado'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};