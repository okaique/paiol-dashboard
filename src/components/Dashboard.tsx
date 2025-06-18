
import { usePaiols } from '@/hooks/usePaiols';
import { PaiolCard } from '@/components/PaiolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Settings, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDragadores } from '@/hooks/useDragadores';
import { useAjudantes } from '@/hooks/useAjudantes';
import { Button } from './ui/button';
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Dashboard = () => {
    const navigate = useNavigate();
    const { data: paiols, isLoading: paioisLoading } = usePaiols();
    const { data: dragadores } = useDragadores();
    const { data: ajudantes } = useAjudantes();

    const statusCounts = paiols?.reduce((acc, paiol) => {
        const status = paiol.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    if (paioisLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Carregando...</div>
                </div>
            </AppLayout>
        );
    }

    const sedeePaiols = paiols?.filter(p => p.localizacao === 'Sede') || [];
    const nenemPaiols = paiols?.filter(p => p.localizacao === 'Neném') || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                Visão geral dos paióis de areia lavada
                </p>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                    <div>
                        <p className="text-2xl font-bold">{statusCounts['VAZIO'] || 0}</p>
                        <p className="text-xs text-muted-foreground">Vazios</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                    <div>
                        <p className="text-2xl font-bold">{statusCounts['DRAGANDO'] || 0}</p>
                        <p className="text-xs text-muted-foreground">Dragando</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-100"></div>
                    <div>
                        <p className="text-2xl font-bold">{statusCounts['CHEIO'] || 0}</p>
                        <p className="text-xs text-muted-foreground">Cheios</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                    <div>
                        <p className="text-2xl font-bold">{statusCounts['RETIRANDO'] || 0}</p>
                        <p className="text-xs text-muted-foreground">Retirando</p>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* Navegação rápida */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/paiols')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Gerenciar Paióis
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/pessoal')}>
                            <Users className="h-4 w-4 mr-2" />
                            Gerenciar Pessoal
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('/configuracoes')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Configurações
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Paióis da Sede */}
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Paióis da Sede</h2>
                    <Badge variant="secondary">{sedeePaiols.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sedeePaiols.map((paiol) => (
                        <PaiolCard key={paiol.id} paiol={paiol} />
                    ))}
                </div>
            </div>

            <Separator />

            {/* Paióis do Neném */}
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Paióls do Neném</h2>
                    <Badge variant="secondary">{nenemPaiols.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nenemPaiols.map((paiol) => (
                        <PaiolCard key={paiol.id} paiol={paiol} />
                    ))}
                </div>
            </div>
        </div>
    );
};
