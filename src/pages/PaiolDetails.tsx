
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PaiolStatusInfo } from '@/components/PaiolStatusInfo';
import { PaiolActions } from '@/components/PaiolActions';
import { RetiradaDialog } from '@/components/RetiradaDialog';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from "@/components/layout/AppLayout";
import type { Retirada } from '@/types/database';
import { usePaiolDetailsData } from '@/hooks/usePaiolDetailsData';
import { PaiolDetailsHeader } from '@/components/paiol-details/PaiolDetailsHeader';
import { PaiolDetailsTabs } from '@/components/paiol-details/PaiolDetailsTabs';
import { PaiolTabsContent } from '@/components/paiol-details/PaiolTabsContent';

const PaiolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isRetiradaDialogOpen, setIsRetiradaDialogOpen] = useState(false);
  const [editingRetirada, setEditingRetirada] = useState<Retirada | null>(null);

  const {
    paiol,
    isLoading,
    dragagemAtiva,
    dragagemMaisRecente,
    dragagemParaCubagem,
    cubagem,
    volumeControl,
    dragador,
    ajudante
  } = usePaiolDetailsData(id || '');

  const handleEditRetirada = (retirada: Retirada) => {
    setEditingRetirada(retirada);
    setIsRetiradaDialogOpen(true);
  };

  const handleNewRetirada = () => {
    setEditingRetirada(null);
    setIsRetiradaDialogOpen(true);
  };

  const handleRetiradaDialogClose = () => {
    setIsRetiradaDialogOpen(false);
    setEditingRetirada(null);
  };

  const handleRetiradaSuccess = () => {
    setIsRetiradaDialogOpen(false);
    setEditingRetirada(null);
    // Optionally refresh data here
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  if (!paiol) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Paiol não encontrado</h2>
            <p className="text-muted-foreground mb-4">O paiol solicitado não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header com navegação */}
          <PaiolDetailsHeader paiol={paiol} />

          {/* Tabs com conteúdo detalhado */}
          <Tabs defaultValue="detalhes" className="space-y-6">
            <PaiolDetailsTabs />

            {/* Informações do Status */}
            <PaiolStatusInfo paiol={paiol} />

            {/* Ações do Paiol */}
            <PaiolActions paiol={paiol} />

            <PaiolTabsContent
              paiol={paiol}
              dragagemAtiva={dragagemAtiva}
              dragagemMaisRecente={dragagemMaisRecente}
              cubagem={cubagem}
              volumeControl={volumeControl}
              dragadorNome={dragador?.nome}
              ajudanteNome={ajudante?.nome}
              onEditRetirada={handleEditRetirada}
              onNewRetirada={handleNewRetirada}
            />
          </Tabs>

          {/* Dialog para retiradas */}
          <RetiradaDialog
            isOpen={isRetiradaDialogOpen}
            onClose={handleRetiradaDialogClose}
            onSuccess={handleRetiradaSuccess}
            paiolId={paiol.id}
            retirada={editingRetirada}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default PaiolDetails;
