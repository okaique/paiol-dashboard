import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FinalizarDragagemDialog } from './FinalizarDragagemDialog';
import { GastosInsumosList } from './GastosInsumosList';
import { PagamentosPessoalList } from './PagamentosPessoalList';
import { ResumoFinanceiroDragagem } from './ResumoFinanceiroDragagem';
import { CustosDragagem } from './CustosDragagem';
import { RelatorioFinalDragagem } from './RelatorioFinalDragagem';
import type { Dragagem } from '@/types/database';
import { useState } from 'react';
interface DragagemDetalhada extends Dragagem {
  dragador?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  ajudante?: {
    id: string;
    nome: string;
    valor_diaria?: number;
  };
  paiol?: {
    id: string;
    nome: string;
    status: string;
  };
}
interface DragagemDetailsProps {
  dragagem: DragagemDetalhada;
  onUpdate?: () => void;
}
export const DragagemDetails = ({
  dragagem,
  onUpdate
}: DragagemDetailsProps) => {
  const [showRelatorio, setShowRelatorio] = useState(false);
  const isDragagemAtiva = !dragagem.data_fim;

  // Se a dragagem foi finalizada e o usuário quer ver o relatório final, mostra apenas ele
  if (!isDragagemAtiva && showRelatorio) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Relatório Final da Dragagem</h2>
          <Button variant="outline" onClick={() => setShowRelatorio(false)}>
            Voltar aos Detalhes
          </Button>
        </div>
        <RelatorioFinalDragagem dragagem={dragagem} />
      </div>;
  }
  return <div className="space-y-6">
      {/* Informações da Dragagem */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isDragagemAtiva ? 'Dragagem em Andamento' : 'Dragagem Finalizada'}
            </CardTitle>
            <div className="flex gap-2">
              {!isDragagemAtiva && <Button size="sm" variant="outline" onClick={() => setShowRelatorio(true)} className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Relatório Final
                </Button>}
              {isDragagemAtiva && <FinalizarDragagemDialog dragagemId={dragagem.id} paiolNome={dragagem.paiol?.nome || 'Paiol'} onSuccess={onUpdate}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Dragagem
                  </Button>
                </FinalizarDragagemDialog>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Equipe</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 ">
                  <span className="text-sm text-muted-foreground">Dragador:</span>
                  <div className="text-right">
                    <p className="font-medium">{dragagem.dragador?.nome}</p>
                    {dragagem.dragador?.valor_diaria && <p className="text-xs text-muted-foreground">
                        R$ {dragagem.dragador.valor_diaria.toFixed(2)}/dia
                      </p>}
                  </div>
                </div>
                {dragagem.ajudante && <div className="flex items-center gap-1.5 ">
                    <span className="text-sm text-muted-foreground">Ajudante:</span>
                    <div className="text-right">
                      <p className="font-medium">{dragagem.ajudante.nome}</p>
                      {dragagem.ajudante.valor_diaria && <p className="text-xs text-muted-foreground">
                          R$ {dragagem.ajudante.valor_diaria.toFixed(2)}/dia
                        </p>}
                    </div>
                  </div>}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Período</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Início: {format(new Date(dragagem.data_inicio), 'dd/MM/yyyy', {
                    locale: ptBR
                  })}</span>
                </div>
                {dragagem.data_fim ? <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Fim: {format(new Date(dragagem.data_fim), 'dd/MM/yyyy', {
                    locale: ptBR
                  })}</span>
                  </div> : <Badge variant="default" className="w-fit">
                    Em andamento
                  </Badge>}
              </div>
            </div>
          </div>

          {dragagem.observacoes && <div className="pt-4 border-t">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-medium mb-1">Observações</h4>
                  <p className="text-sm text-muted-foreground">{dragagem.observacoes}</p>
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>

      {/* Resumo Financeiro - Sprint 14 */}
      <ResumoFinanceiroDragagem dragagemId={dragagem.id} />

      {/* Interface de Custos Detalhada - Sprint 14 */}
      <CustosDragagem dragagemId={dragagem.id} />

      {/* Lista de gastos com insumos */}
      <GastosInsumosList dragagemId={dragagem.id} />

      {/* Lista de pagamentos de pessoal */}
      <PagamentosPessoalList dragagemId={dragagem.id} dragadorId={dragagem.dragador_id} dragadorNome={dragagem.dragador?.nome || 'Dragador'} ajudanteId={dragagem.ajudante_id || undefined} ajudanteNome={dragagem.ajudante?.nome} />
    </div>;
};