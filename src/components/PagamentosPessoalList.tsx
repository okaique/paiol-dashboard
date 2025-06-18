
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash, Plus, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
import { usePagamentoPessoalMutations } from '@/hooks/usePagamentosPessoalMutations';
import { PagamentoPessoalDialog } from './PagamentoPessoalDialog';
import type { PagamentoPessoal } from '@/types/database';

interface PagamentosPessoalListProps {
  dragagemId: string;
  dragadorId: string;
  dragadorNome: string;
  ajudanteId?: string;
  ajudanteNome?: string;
}

export const PagamentosPessoalList = ({
  dragagemId,
  dragadorId,
  dragadorNome,
  ajudanteId,
  ajudanteNome,
}: PagamentosPessoalListProps) => {
  const { data: pagamentos, isLoading, error, refetch } = usePagamentosPessoal(dragagemId);
  const { deletePagamentoPessoal } = usePagamentoPessoalMutations();

  const handleDelete = async (id: string) => {
    try {
      await deletePagamentoPessoal.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
    }
  };

  const getTipoPagamentoBadge = (tipo: string) => {
    return tipo === 'ADIANTAMENTO' ? (
      <Badge variant="secondary">Adiantamento</Badge>
    ) : (
      <Badge variant="default">Pagamento Final</Badge>
    );
  };

  const getTipoPessoaBadge = (tipo: string) => {
    return tipo === 'DRAGADOR' ? (
      <Badge variant="outline">Dragador</Badge>
    ) : (
      <Badge variant="outline">Ajudante</Badge>
    );
  };

  const getNomePessoa = (pagamento: PagamentoPessoal) => {
    if (pagamento.pessoa_id === dragadorId) {
      return dragadorNome;
    }
    if (ajudanteId && pagamento.pessoa_id === ajudanteId) {
      return ajudanteNome;
    }
    return 'Pessoa não encontrada';
  };

  const getTotalPagamentos = () => {
    return pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando pagamentos...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Erro ao carregar pagamentos
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pagamentos e Adiantamentos
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total pago: <span className="font-semibold">R$ {getTotalPagamentos().toFixed(2)}</span>
            </p>
          </div>
          <PagamentoPessoalDialog
            dragagemId={dragagemId}
            dragadorId={dragadorId}
            dragadorNome={dragadorNome}
            ajudanteId={ajudanteId}
            ajudanteNome={ajudanteNome}
            onSuccess={() => refetch()}
          >
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Pagamento
            </Button>
          </PagamentoPessoalDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pessoa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos?.map((pagamento) => (
              <TableRow key={pagamento.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{getNomePessoa(pagamento)}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getTipoPessoaBadge(pagamento.tipo_pessoa)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getTipoPagamentoBadge(pagamento.tipo_pagamento)}
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    R$ {pagamento.valor.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <PagamentoPessoalDialog
                      dragagemId={dragagemId}
                      dragadorId={dragadorId}
                      dragadorNome={dragadorNome}
                      ajudanteId={ajudanteId}
                      ajudanteNome={ajudanteNome}
                      pagamento={pagamento}
                      onSuccess={() => refetch()}
                    >
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PagamentoPessoalDialog>
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
                            Tem certeza que deseja remover este pagamento? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pagamento.id)}
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
            {pagamentos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum pagamento registrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {pagamentos && pagamentos.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Resumo dos Pagamentos:</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Adiantamentos: </span>
                <span className="font-medium">
                  R$ {pagamentos
                    .filter(p => p.tipo_pagamento === 'ADIANTAMENTO')
                    .reduce((total, p) => total + p.valor, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Pagamentos Finais: </span>
                <span className="font-medium">
                  R$ {pagamentos
                    .filter(p => p.tipo_pagamento === 'PAGAMENTO_FINAL')
                    .reduce((total, p) => total + p.valor, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
