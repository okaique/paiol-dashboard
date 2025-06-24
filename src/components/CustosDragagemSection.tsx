
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Package, Users, Coins, AlertCircle, Info } from 'lucide-react';
import { GastosInsumosList } from './GastosInsumosList';
import { PagamentosPessoalList } from './PagamentosPessoalList';
import { GastoInsumoDialog } from './GastoInsumoDialog';
import { PagamentoPessoalDialog } from './PagamentoPessoalDialog';
import { useState } from 'react';
import type { Paiol, Dragagem } from '@/types/database';

interface CustosDragagemSectionProps {
  paiol: Paiol;
  dragagem?: Dragagem;
  dragadorId?: string;
  dragadorNome?: string;
  ajudanteId?: string;
  ajudanteNome?: string;
}

export const CustosDragagemSection = ({
  paiol,
  dragagem,
  dragadorId,
  dragadorNome,
  ajudanteId,
  ajudanteNome,
}: CustosDragagemSectionProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Se não há dragagem, não mostra a seção
  if (!dragagem) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="border-2 border-dashed border-muted">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-muted-foreground">
              <AlertCircle className="h-6 w-6" />
              Custos da Dragagem
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhuma dragagem encontrada
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  É necessário ter uma dragagem ativa ou finalizada para registrar custos. 
                  Inicie uma dragagem no paiol para começar a registrar gastos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFinalized = dragagem.data_fim !== null;
  const canRegisterCosts = true; // Sempre permitir registro de custos

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6" key={refreshKey}>
      {/* Header com informações da dragagem */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Custos da Dragagem
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ciclo {paiol.ciclo_atual} - {paiol.nome}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={isFinalized ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                {isFinalized ? 'Finalizada' : 'Em Andamento'}
              </Badge>
              {paiol.status === 'VAZIO' && (
                <Badge variant="outline" className="px-3 py-1">
                  Ciclo Fechado
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Início:</span>
              <p className="font-semibold">
                {new Date(dragagem.data_inicio).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>
            {dragagem.data_fim && (
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Fim:</span>
                <p className="font-semibold">
                  {new Date(dragagem.data_fim).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
            {dragadorNome && (
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Dragador:</span>
                <p className="font-semibold truncate" title={dragadorNome}>
                  {dragadorNome}
                </p>
              </div>
            )}
            {ajudanteNome && (
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Ajudante:</span>
                <p className="font-semibold truncate" title={ajudanteNome}>
                  {ajudanteNome}
                </p>
              </div>
            )}
          </div>
          
          {paiol.status === 'VAZIO' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Ciclo Finalizado - Edição Permitida
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Este ciclo foi finalizado, mas você ainda pode registrar gastos esquecidos 
                    ou fazer correções nos valores já inseridos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GastoInsumoDialog dragagemId={dragagem.id} onSuccess={handleRefresh}>
          <Button 
            className="w-full h-auto py-6 px-6 hover:shadow-lg transition-all duration-200" 
            disabled={!canRegisterCosts}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Package className="h-8 w-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-base">Registrar Gasto com Insumo</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Combustível, óleo, manutenção, peças, etc.
                </p>
              </div>
            </div>
          </Button>
        </GastoInsumoDialog>

        {dragadorId && dragadorNome && (
          <PagamentoPessoalDialog
            dragagemId={dragagem.id}
            dragadorId={dragadorId}
            dragadorNome={dragadorNome}
            ajudanteId={ajudanteId}
            ajudanteNome={ajudanteNome}
            onSuccess={handleRefresh}
          >
            <Button 
              variant="outline" 
              className="w-full h-auto py-6 px-6 border-2 hover:shadow-lg transition-all duration-200 hover:border-primary/50" 
              disabled={!canRegisterCosts}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-base">Registrar Pagamento</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Adiantamentos e pagamentos finais
                  </p>
                </div>
              </div>
            </Button>
          </PagamentoPessoalDialog>
        )}
      </div>

      {/* Listas de Gastos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GastosInsumosList dragagemId={dragagem.id} />
        </div>
        {dragadorId && dragadorNome && (
          <div className="space-y-4">
            <PagamentosPessoalList 
              dragagemId={dragagem.id}
              dragadorId={dragadorId}
              dragadorNome={dragadorNome}
              ajudanteId={ajudanteId}
              ajudanteNome={ajudanteNome}
            />
          </div>
        )}
      </div>
    </div>
  );
};
