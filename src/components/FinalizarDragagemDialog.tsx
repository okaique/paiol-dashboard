
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFinalizarDragagem } from '@/hooks/useDragagemMutations';
import { useGastosInsumos } from '@/hooks/useGastosInsumos';
import { usePagamentosPessoal } from '@/hooks/usePagamentosPessoal';
import { CheckCircle, AlertTriangle, DollarSign, Users } from 'lucide-react';

interface FinalizarDragagemDialogProps {
  dragagemId: string;
  paiolNome: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const FinalizarDragagemDialog = ({ 
  dragagemId, 
  paiolNome, 
  children, 
  onSuccess 
}: FinalizarDragagemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  
  const finalizarDragagem = useFinalizarDragagem();
  const { data: gastos } = useGastosInsumos(dragagemId);
  const { data: pagamentos } = usePagamentosPessoal(dragagemId);

  const totalGastosInsumos = gastos?.reduce((total, gasto) => total + gasto.valor_total, 0) || 0;
  const totalPagamentos = pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0) || 0;
  const totalGeral = totalGastosInsumos + totalPagamentos;

  const hasGastos = gastos && gastos.length > 0;
  const hasPagamentos = pagamentos && pagamentos.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await finalizarDragagem.mutateAsync({
        id: dragagemId,
        observacoes: observacoes || undefined
      });
      
      setOpen(false);
      setObservacoes('');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao finalizar dragagem:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Finalizar Dragagem - {paiolNome}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Resumo Financeiro da Dragagem
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Gastos com Insumos:</p>
                <p className="font-semibold">R$ {totalGastosInsumos.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{gastos?.length || 0} registros</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pagamentos Pessoal:</p>
                <p className="font-semibold">R$ {totalPagamentos.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{pagamentos?.length || 0} pagamentos</p>
              </div>
            </div>
            <div className="pt-3 border-t mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Investido:</span>
                <span className="text-lg font-bold text-primary">R$ {totalGeral.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Validações */}
          <div className="space-y-3">
            {!hasGastos && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum gasto com insumos foi registrado para esta dragagem.
                </AlertDescription>
              </Alert>
            )}
            
            {!hasPagamentos && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum pagamento de pessoal foi registrado para esta dragagem.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Ao finalizar a dragagem, o paiol será automaticamente marcado como <strong>CHEIO</strong> e ficará pronto para iniciar as retiradas de areia.
              </AlertDescription>
            </Alert>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Finais</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Adicione observações sobre a finalização da dragagem..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={finalizarDragagem.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={finalizarDragagem.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {finalizarDragagem.isPending ? 'Finalizando...' : 'Finalizar Dragagem'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
