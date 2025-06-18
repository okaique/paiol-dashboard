import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calculator } from 'lucide-react';
import { CubagemInfo } from '@/components/CubagemInfo';
import { VolumeInfo } from '@/components/VolumeInfo';
import { useVolumeControl } from '@/hooks/useVolumeControl';
import type { Paiol, Dragagem, Cubagem } from '@/types/database';

interface StatusRetirandoProps {
    paiol: Paiol;
    dragagemMaisRecente?: Dragagem;
    cubagem?: Cubagem;
}

export const StatusRetirando = ({ paiol, dragagemMaisRecente, cubagem }: StatusRetirandoProps) => {
    const volumeControl = useVolumeControl(paiol.id, dragagemMaisRecente?.id);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-yellow-600" />
                            <span>Status: Retirando</span>
                        </div>
                        {cubagem && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Calculator className="h-3 w-3" />
                                Volume Controlado
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Retiradas de areia em andamento. O paiol está sendo esvaziado gradualmente.
                    </p>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <strong>Atenção:</strong> Controle o volume disponível para evitar vendas em excesso.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};