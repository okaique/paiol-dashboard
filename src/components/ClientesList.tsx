
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
import { Edit, Trash2 } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useDeleteCliente } from '@/hooks/useClienteMutations';
import { useListFilters } from '@/hooks/useListFilters';
import { ListFilters } from './ListFilters';
import { useMemo } from 'react';
import type { Cliente } from '@/types/database';

interface ClientesListProps {
  onEdit: (cliente: Cliente) => void;
}

const tipoOptions = [
  { value: 'FISICA', label: 'Pessoa Física' },
  { value: 'JURIDICA', label: 'Pessoa Jurídica' },
];

export const ClientesList = ({ onEdit }: ClientesListProps) => {
  const { data: clientes = [], isLoading, error } = useClientes();
  const deleteCliente = useDeleteCliente();

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilter,
    clearFilters,
    setQuickDateFilter,
  } = useListFilters();

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      // Filtro de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = cliente.nome.toLowerCase().includes(searchLower);
        const matchesCpfCnpj = cliente.cpf_cnpj?.toLowerCase().includes(searchLower);
        const matchesEmail = cliente.email?.toLowerCase().includes(searchLower);
        const matchesTelefone = cliente.telefone?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesCpfCnpj && !matchesEmail && !matchesTelefone) {
          return false;
        }
      }

      // Filtro de status (tipo de pessoa)
      if (filters.status && cliente.tipo_pessoa !== filters.status) {
        return false;
      }

      // Filtro de data
      if (filters.dateFrom) {
        const clienteDate = new Date(cliente.created_at).toISOString().split('T')[0];
        if (clienteDate < filters.dateFrom) {
          return false;
        }
      }

      if (filters.dateTo) {
        const clienteDate = new Date(cliente.created_at).toISOString().split('T')[0];
        if (clienteDate > filters.dateTo) {
          return false;
        }
      }

      return true;
    });
  }, [clientes, filters]);

  const handleDelete = async (id: string) => {
    await deleteCliente.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando clientes...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar clientes. Tente novamente.
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
            Lista de Clientes
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Filtrado
              </Badge>
            )}
          </CardTitle>
        </div>
        
        <ListFilters
          filters={filters}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          onQuickDateFilter={setQuickDateFilter}
          statusOptions={tipoOptions}
          showStatus={true}
          showDateFilters={true}
          searchPlaceholder="Buscar por nome, CPF/CNPJ, email ou telefone..."
        />
      </CardHeader>
      <CardContent>
        {filteredClientes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {hasActiveFilters ? 'Nenhum cliente encontrado com os filtros aplicados.' : 'Nenhum cliente cadastrado.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.tipo_pessoa === 'FISICA' ? 'default' : 'secondary'}>
                      {cliente.tipo_pessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </TableCell>
                  <TableCell>{cliente.cpf_cnpj || '-'}</TableCell>
                  <TableCell>{cliente.telefone || '-'}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(cliente)}
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
                              Tem certeza que deseja remover o cliente "{cliente.nome}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cliente.id)}
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
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
