
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Edit, Trash2, Plus, Check, X, Truck } from 'lucide-react';
import { useRetiradas } from '@/hooks/useRetiradas';
import { useDeleteRetirada, useUpdateRetirada } from '@/hooks/useRetiradaMutations';
import { useListFilters } from '@/hooks/useListFilters';
import { ListFilters } from './ListFilters';
import type { Retirada } from '@/types/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RetiradasListProps {
  paiolId: string;
  statusPaiol: string;
  onEdit: (retirada: Retirada) => void;
  onNew: () => void;
}

const statusPagamentoOptions = [
  { value: 'PAGO', label: 'Pago' },
  { value: 'NAO_PAGO', label: 'Não Pago' },
];

export const RetiradasList = ({ paiolId, onEdit, onNew, statusPaiol }: RetiradasListProps) => {
  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
    setQuickDateFilter,
  } = useListFilters();

  const { data: retiradas = [], isLoading, error } = useRetiradas(paiolId, {
    dataInicio: filters.dateFrom || undefined,
    dataFim: filters.dateTo || undefined,
    clienteNome: filters.searchTerm || undefined,
    statusPagamento: filters.status || undefined,
  });
  
  const deleteRetirada = useDeleteRetirada();
  const updateRetirada = useUpdateRetirada();

  const handleDelete = async (id: string) => {
    await deleteRetirada.mutateAsync(id);
  };

  const handleTogglePayment = async (retirada: any) => {
    const newStatus: 'PAGO' | 'NAO_PAGO' = retirada.status_pagamento === 'PAGO' ? 'NAO_PAGO' : 'PAGO';
    const updateData = {
      id: retirada.id,
      status_pagamento: newStatus,
      data_pagamento: newStatus === 'PAGO' ? new Date().toISOString() : null,
    };
    
    await updateRetirada.mutateAsync(updateData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando retiradas...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar retiradas. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Retiradas
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Filtrado
              </Badge>
            )}
          </CardTitle>
          <Button
            onClick={onNew}
            size="sm"
            disabled={statusPaiol === 'DRAGANDO' || statusPaiol === 'VAZIO'}
            title={
              statusPaiol === 'DRAGANDO' || statusPaiol === 'VAZIO'
                ? 'Não é possível registrar retirada enquanto o paiol estiver dragando ou vazio.'
                : ''
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Retirada
          </Button>
        </div>

        <ListFilters
          filters={filters}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          onQuickDateFilter={setQuickDateFilter}
          statusOptions={statusPagamentoOptions}
          showStatus={true}
          showDateFilters={true}
          searchPlaceholder="Buscar por nome do cliente..."
        />
      </CardHeader>
      <CardContent>
        {retiradas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters 
              ? "Nenhuma retirada encontrada com os filtros aplicados."
              : "Nenhuma retirada registrada para este paiol."
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Frete</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retiradas.map((retirada: any) => (
                <TableRow key={retirada.id}>
                  <TableCell>
                    {format(new Date(retirada.data_retirada), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{retirada.clientes?.nome || 'N/A'}</TableCell>
                  <TableCell>{retirada.volume_retirado} m³</TableCell>
                  <TableCell>
                    {retirada.valor_unitario 
                      ? `R$ ${retirada.valor_unitario.toFixed(2)}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {retirada.valor_total 
                      ? `R$ ${retirada.valor_total.toFixed(2)}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {retirada.tem_frete ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="bg-blue-50 w-fit">
                            <Truck className="h-3 w-3 mr-1" />
                            Sim
                          </Badge>
                          {retirada.valor_frete && (
                            <span className="text-xs text-muted-foreground">
                              R$ {retirada.valor_frete.toFixed(2)}
                            </span>
                          )}
                          {retirada.caminhao_frete?.placa && (
                            <span className="text-xs text-muted-foreground">
                              {retirada.caminhao_frete.placa}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={retirada.status_pagamento === 'PAGO' ? 'default' : 'secondary'}
                      className={retirada.status_pagamento === 'PAGO' ? 'bg-green-600' : 'bg-red-600'}
                    >
                      {retirada.status_pagamento === 'PAGO' ? 'Pago' : 'Não Pago'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {retirada.data_pagamento 
                      ? format(new Date(retirada.data_pagamento), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR,
                        })
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePayment(retirada)}
                        title={retirada.status_pagamento === 'PAGO' ? 'Marcar como não pago' : 'Marcar como pago'}
                      >
                        {retirada.status_pagamento === 'PAGO' ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(retirada)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta retirada?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(retirada.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
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
