
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useEquipamento } from '@/hooks/useEquipamento';
import { ManutencoesList } from '@/components/ManutencoesList';
import { ManutencaoDialog } from '@/components/ManutencaoDialog';
import { AbastecimentosList } from '@/components/AbastecimentosList';
import { AbastecimentoDialog } from '@/components/AbastecimentoDialog';

export default function EquipamentoDetails() {
  const { id } = useParams<{ id: string }>();
  const [manutencaoDialogOpen, setManutencaoDialogOpen] = useState(false);
  const [abastecimentoDialogOpen, setAbastecimentoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manutencoes');
  
  const { data: equipamento, isLoading, error } = useEquipamento(id!);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div>Carregando equipamento...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !equipamento) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Equipamento não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O equipamento solicitado não foi encontrado ou você não tem permissão para acessá-lo.
            </p>
            <Button asChild>
              <Link to="/equipamentos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Equipamentos
              </Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleNewClick = () => {
    if (activeTab === 'manutencoes') {
      setManutencaoDialogOpen(true);
    } else if (activeTab === 'abastecimentos') {
      setAbastecimentoDialogOpen(true);
    }
  };

  const getButtonText = () => {
    if (activeTab === 'manutencoes') {
      return 'Nova Manutenção';
    } else if (activeTab === 'abastecimentos') {
      return 'Novo Abastecimento';
    }
    return 'Adicionar';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/equipamentos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{equipamento.modelo}</h1>
              <p className="text-muted-foreground">
                {equipamento.placa ? `Placa: ${equipamento.placa}` : 'Sem placa cadastrada'}
              </p>
            </div>
          </div>
          
          <Button onClick={handleNewClick}>
            <Plus className="h-4 w-4 mr-2" />
            {getButtonText()}
          </Button>
        </div>

        {/* Informações do Equipamento */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Equipamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                <p className="text-lg">{equipamento.modelo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="text-lg">
                  {equipamento.placa || 'Não informado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas para Manutenções e Abastecimentos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
            <TabsTrigger value="abastecimentos">Abastecimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manutencoes">
            <ManutencoesList equipamentoId={equipamento.id} />
          </TabsContent>
          
          <TabsContent value="abastecimentos">
            <AbastecimentosList equipamentoId={equipamento.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ManutencaoDialog
        open={manutencaoDialogOpen}
        onOpenChange={setManutencaoDialogOpen}
        equipamentoId={equipamento.id}
      />

      <AbastecimentoDialog
        open={abastecimentoDialogOpen}
        onOpenChange={setAbastecimentoDialogOpen}
        equipamentoId={equipamento.id}
      />
    </AppLayout>
  );
}
