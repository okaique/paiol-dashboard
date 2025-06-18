
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PaiolStatusInfo } from '@/components/PaiolStatusInfo';
import { PaiolActions } from '@/components/PaiolActions';
import { DragagemDetails } from '@/components/DragagemDetails';
import { CubagemInfo } from '@/components/CubagemInfo'; 
import { RetiradasList } from '@/components/RetiradasList';
import { HistoricoCiclos } from '@/components/HistoricoCiclos';
import { LinhaTempoBasica } from '@/components/LinhaTempoBasica';
import { RetiradaDialog } from '@/components/RetiradaDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaiols } from '@/hooks/usePaiols';
import { useDragagemAtiva, useDragagemMaisRecente } from '@/hooks/useDragagens';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AppLayout } from "@/components/layout/AppLayout";
import type { Retirada } from '@/types/database';
import { VolumeInfo } from '@/components/VolumeInfo';
import { Card, CardContent } from '@/components/ui/card';
import { useVolumeControl } from '@/hooks/useVolumeControl';
import type { Paiol, Dragagem, Cubagem } from '@/types/database';

const PaiolDetails = () => {
    
    const { id } = useParams<{ id: string }>();
    const { data: paiols, isLoading } = usePaiols();
    const [isRetiradaDialogOpen, setIsRetiradaDialogOpen] = useState(false);
    const [editingRetirada, setEditingRetirada] = useState<Retirada | null>(null);

    const paiol = paiols?.find(p => p.id === id);
    const { data: dragagemAtiva } = useDragagemAtiva(id || '');
    const { data: dragagemMaisRecente } = useDragagemMaisRecente(id || '');

    // Para cubagem, usamos a dragagem mais recente se não houver dragagem ativa
    const dragagemParaCubagem = dragagemAtiva || dragagemMaisRecente;
    const { data: cubagem } = useCubagemPorDragagem(dragagemParaCubagem?.id || '');

    // Only call useVolumeControl if paiol exists
    const volumeControl = useVolumeControl(paiol?.id || '', dragagemParaCubagem?.id);

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
            <div className="space-y-6">
                {/* Header com navegação */}
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                    </Button>
                    <div>
                    <h1 className="text-3xl font-bold">{paiol.nome}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={
                        paiol.status === 'VAZIO' ? 'secondary' :
                        paiol.status === 'DRAGANDO' ? 'default' :
                        paiol.status === 'CHEIO' ? 'destructive' :
                        'outline'
                        }>
                        {paiol.status}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                        Ciclo Atual: {paiol.ciclo_atual || 1}
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Tabs com conteúdo detalhado */}
                <Tabs defaultValue="detalhes" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        <TabsTrigger value="dragagem">Dragagem</TabsTrigger>
                        <TabsTrigger value="cubagem">Cubagem</TabsTrigger>
                        <TabsTrigger value="retiradas">Retiradas</TabsTrigger>
                        <TabsTrigger value="historico">Histórico</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>

                    {/* Informações do Status */}
                    <PaiolStatusInfo paiol={paiol} />

                    {/* Ações do Paiol */}
                    <PaiolActions paiol={paiol} />

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

                    <TabsContent value="retiradas">
                        <RetiradasList 
                        paiolId={paiol.id}
                        statusPaiol={paiol.status}
                        onEdit={handleEditRetirada}
                        onNew={handleNewRetirada}
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
        </AppLayout>
    );
};

export default PaiolDetails;
