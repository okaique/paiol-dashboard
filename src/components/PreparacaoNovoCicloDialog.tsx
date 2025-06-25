
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePreparacaoNovoCiclo } from '@/hooks/usePreparacaoNovoCiclo';
import { useDragagemAtiva } from '@/hooks/useDragagens';
import type { Paiol } from '@/types/database';
import { ArrowRight, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface PreparacaoNovoCicloDialogProps {
  paiol: Paiol;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const PreparacaoNovoCicloDialog = ({ 
  paiol, 
  children, 
  onSuccess 
}: PreparacaoNovoCicloDialogProps) => {
  const [open, setOpen] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const { preparaNovoCiclo, isLoading } = usePreparacaoNovoCiclo();
  const { data: dragagemAtiva } = useDragagemAtiva(paiol.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await preparaNovoCiclo.mutateAsync({
        paiolId: paiol.id,
        observacoes: observacoes || `Preparação para Ciclo ${paiol.ciclo_atual}`,
      });
      
      setOpen(false);
      setObservacoes('');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao preparar novo ciclo:', error);
    }
  };

  const isReadyForNewCycle = paiol.status === 'VAZIO' && !dragagemAtiva;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-1">
          <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="truncate">Preparar Novo Ciclo - {paiol.nome}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-1">
          {/* Visualização do ciclo atual */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 p-3 sm:p-4 bg-muted rounded-lg">
            <div className="text-center min-w-0 flex-1">
              <div className="text-sm sm:text-lg font-semibold text-blue-600 truncate">
                Ciclo {paiol.ciclo_atual - 1}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Finalizado</div>
            </div>
            <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0" />
            <div className="text-center min-w-0 flex-1">
              <div className="text-sm sm:text-lg font-semibold text-green-600 truncate">
                Ciclo {paiol.ciclo_atual}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Preparação</div>
            </div>
          </div>

          {/* Status de preparação */}
          {isReadyForNewCycle ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-medium text-green-700 text-sm">Paiol Pronto para Preparação</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  O paiol está vazio e sem dragagem ativa. Pode ser preparado para o novo ciclo.
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <p className="font-medium text-yellow-700 text-sm">Verificar Status</p>
                <p className="text-xs sm:text-sm text-yellow-600 mt-1 break-words">
                  {paiol.status !== 'VAZIO' && 'O paiol deve estar vazio para preparar novo ciclo. '}
                  {dragagemAtiva && 'Existe uma dragagem ativa que precisa ser finalizada.'}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Resumo do que será feito */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2 text-sm sm:text-base">Ações da Preparação</h4>
            <ul className="text-xs sm:text-sm text-blue-600 space-y-1">
              <li>• Arquivamento dos dados do ciclo anterior</li>
              <li>• Reset das configurações temporárias</li>
              <li>• Preparação do paiol para nova dragagem</li>
              <li>• Registro no histórico de status</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm">Observações da Preparação</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder={`Preparação do Ciclo ${paiol.ciclo_atual} - Adicione observações sobre a preparação...`}
                rows={3}
                className="text-sm"
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium text-sm">Informação</p>
                <p className="text-xs sm:text-sm mt-1">
                  Esta ação prepara o paiol para o Ciclo {paiol.ciclo_atual}, 
                  organizando os dados e deixando tudo pronto para uma nova dragagem.
                </p>
              </AlertDescription>
            </Alert>
          </form>
        </div>

        {/* Botões fixos na parte inferior */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t flex-shrink-0 px-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto text-sm"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading || !isReadyForNewCycle}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm"
          >
            {isLoading ? 'Preparando...' : 'Preparar Novo Ciclo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
