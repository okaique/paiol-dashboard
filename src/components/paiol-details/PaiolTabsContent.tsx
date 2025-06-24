
import { TabsContent } from '@/components/ui/tabs';
import { DragagemDetails } from '@/components/DragagemDetails';
import { CubagemInfo } from '@/components/CubagemInfo';
import { RetiradasList } from '@/components/RetiradasList';
import { HistoricoCiclos } from '@/components/HistoricoCiclos';
import { LinhaTempoBasica } from '@/components/LinhaTempoBasica';
import { CustosDragagemSection } from '@/components/CustosDragagemSection';
import { VolumeInfo } from '@/components/VolumeInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import type { Paiol, Dragagem, Cubagem, Retirada } from '@/types/database';
import type { VolumeControlResult } from '@/types/volume-control';

interface PaiolTabsContentProps {
  paiol: Paiol;
  dragagemAtiva?: Dragagem;
  dragagemMaisRecente?: Dragagem;
  cubagem?: Cubagem;
  volumeControl: VolumeControlResult;
  dragadorNome?: string;
  ajudanteNome?: string;
  onEditRetirada: (retirada: Retirada) => void;
  onNewRetirada: () => void;
}

export const PaiolTabsContent = ({
  paiol,
  dragagemAtiva,
  dragagemMaisRecente,
  cubagem,
  volumeControl,
  dragadorNome,
  ajudanteNome,
  onEditRetirada,
  onNewRetirada
}: PaiolTabsContentProps) => {
  const dragagemParaCubagem = dragagemAtiva || dragagemMaisRecente;

  return (
    <>
      <TabsContent value="detalhes" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Conteúdo dos detalhes básicos */}
        </div>
      </TabsContent>

      <TabsContent value="dragagem">
        {dragagemAtiva ? (
          <DragagemDetails dragagem={dragagemAtiva} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma dragagem ativa encontrada</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="cubagem">
        {cubagem ? (
          <CubagemInfo cubagem={cubagem} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma cubagem encontrada</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="custos" className="space-y-0">
        <CustosDragagemSection
          paiol={paiol}
          dragagem={dragagemParaCubagem}
          dragadorId={dragagemParaCubagem?.dragador_id}
          dragadorNome={dragadorNome}
          ajudanteId={dragagemParaCubagem?.ajudante_id}
          ajudanteNome={ajudanteNome}
        />
      </TabsContent>

      <TabsContent value="retiradas">
        <RetiradasList 
          paiolId={paiol.id}
          statusPaiol={paiol.status}
          onEdit={onEditRetirada}
          onNew={onNewRetirada}
        />
        
        <div className="mt-4">
          {/* Informações de Volume */}
          {cubagem && (
            <VolumeInfo
              volumeTotal={volumeControl.volumeTotal}
              volumeRetirado={volumeControl.volumeRetirado}
              volumeDisponivel={volumeControl.volumeDisponivel}
              percentualUtilizado={volumeControl.percentualUtilizado}
            />
          )}

          <div className="mt-4">
            {/* Informações detalhadas de cubagem */}
            {cubagem && <CubagemInfo cubagem={cubagem} />}

            {/* Aviso se não há cubagem */}
            {!cubagem && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-700">
                    <Calculator className="h-5 w-5" />
                    <p className="font-medium">Cubagem Não Registrada</p>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    Sem a cubagem registrada, não é possível controlar adequadamente o volume disponível para retiradas.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="historico">
        <HistoricoCiclos paiol={paiol} />
      </TabsContent>

      <TabsContent value="timeline">
        <LinhaTempoBasica paiol={paiol} />
      </TabsContent>
    </>
  );
};
