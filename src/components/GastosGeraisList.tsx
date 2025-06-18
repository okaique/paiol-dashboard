
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGastosGerais } from '@/hooks/useGastosGerais';
import { useGastoGeralMutations } from '@/hooks/useGastoGeralMutations';
import { useListFilters } from '@/hooks/useListFilters';
import { ListFilters } from './ListFilters';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GastoGeralForm } from './GastoGeralForm';
import type { GastoGeral } from '@/types/database';

export const GastosGeraisList = () => {
  const { data: gastosGerais, isLoading } = useGastosGerais();
  const { deleteGastoGeral } = useGastoGeralMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingGasto, setEditingGasto] = useState<GastoGeral | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
    setQuickDateFilter,
  } = useListFilters();

  const filteredGastos = useMemo(() => {
    if (!gastosGerais) return [];

    return gastosGerais.filter((gasto) => {
      // Filtro de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesResponsavel = gasto.responsavel?.toLowerCase().includes(searchLower);
        const matchesObservacoes = gasto.observacoes?.toLowerCase().includes(searchLower);
        const matchesEquipamento = (gasto as any).equipamento?.modelo?.toLowerCase().includes(searchLower);
        const matchesTipo = (gasto as any).tipo?.nome?.toLowerCase().includes(searchLower);
        
        if (!matchesResponsavel && !matchesObservacoes && !matchesEquipamento && !matchesTipo) {
          return false;
        }
      }

      // Filtro de data
      if (filters.dateFrom) {
        if (new Date(gasto.data) < new Date(filters.dateFrom)) {
          return false;
        }
      }

      if (filters.dateTo) {
        if (new Date(gasto.data) > new Date(filters.dateTo + 'T23:59:59')) {
          return false;
        }
      }

      return true;
    });
  }, [gastosGerais, filters]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGastoGeral.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (gasto: GastoGeral) => {
    setEditingGasto(gasto);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGasto(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando gastos gerais...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Gastos Gerais
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
                onQuickDateFilter={setQuickDateFilter}
                searchPlaceholder="Buscar por responsável, equipamento, tipo ou observações..."
                showDateFilters={true}
              />
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Gasto
          </Button>
        </CardHeader>
        <CardContent>
          {!filteredGastos || filteredGastos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {hasActiveFilters 
                ? 'Nenhum gasto encontrado com os filtros aplicados'
                : 'Nenhum gasto registrado'
              }
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Geral</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(filteredGastos.reduce((sum, gasto) => sum + gasto.valor, 0))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Gastos</p>
                        <p className="text-lg font-semibold">{filteredGastos.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gasto Médio</p>
                        <p className="text-lg font-semibold">
                          {filteredGastos.length > 0 
                            ? formatCurrency(filteredGastos.reduce((sum, gasto) => sum + gasto.valor, 0) / filteredGastos.length)
                            : formatCurrency(0)
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGastos.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell>{formatDate(gasto.data)}</TableCell>
                      <TableCell>{(gasto as any).equipamento?.modelo || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(gasto as any).tipo?.nome || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(gasto.valor)}
                      </TableCell>
                      <TableCell>{gasto.responsavel || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {gasto.observacoes || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(gasto)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Gasto</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(gasto.id)}
                                  disabled={deletingId === gasto.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === gasto.id ? 'Excluindo...' : 'Excluir'}
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
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGasto ? 'Editar Gasto Geral' : 'Novo Gasto Geral'}
            </DialogTitle>
          </DialogHeader>
          <GastoGeralForm
            gastoGeral={editingGasto || undefined}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
