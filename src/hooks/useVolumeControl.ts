
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCubagemPorDragagem } from './useCubagens';
import { useRetiradas } from './useRetiradas';
import { useDragagemMaisRecente } from './useDragagens';

interface VolumeControl {
  volumeTotal: number;
  volumeRetirado: number;
  volumeDisponivel: number;
  podeRetirar: (volume: number) => boolean;
  percentualUtilizado: number;
  permitirRetirada: boolean;
}

export const useVolumeControl = (paiolId: string, dragagemId?: string): VolumeControl => {
  // Se não temos dragagemId, buscar a dragagem mais recente
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiolId);
  
  // Usar o dragagemId fornecido ou o da dragagem mais recente
  const dragagemIdFinal = dragagemId || dragagemMaisRecente?.id;
  
  const { data: cubagem } = useCubagemPorDragagem(dragagemIdFinal || '');
  
  // Buscar dados do paiol para obter o ciclo atual
  const { data: paiol } = useQuery({
    queryKey: ['paiol-info', paiolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paiols')
        .select('ciclo_atual')
        .eq('id', paiolId)
        .single();

      if (error) {
        console.error('Erro ao buscar paiol:', error);
        return null;
      }

      return data;
    },
    enabled: !!paiolId,
  });

  // Buscar todas as retiradas do paiol (sem filtro de ciclo por enquanto)
  const { data: todasRetiradas = [] } = useRetiradas(paiolId);

  console.log('useVolumeControl - paiolId:', paiolId);
  console.log('useVolumeControl - dragagemId fornecido:', dragagemId);
  console.log('useVolumeControl - dragagemMaisRecente:', dragagemMaisRecente);
  console.log('useVolumeControl - dragagemIdFinal:', dragagemIdFinal);
  console.log('useVolumeControl - cubagem encontrada:', cubagem);
  console.log('useVolumeControl - ciclo atual:', paiol?.ciclo_atual);
  console.log('useVolumeControl - todas retiradas:', todasRetiradas);

  // Calcular volume total (usar volume reduzido da cubagem)
  const volumeTotal = cubagem?.volume_reduzido || 0;

  // Calcular volume já retirado (somar todas as retiradas do ciclo atual)
  // Para simplificar, vamos considerar todas as retiradas por enquanto
  // TODO: Implementar filtro por ciclo quando necessário
  const volumeRetirado = todasRetiradas.reduce((total, retirada) => {
    const volume = retirada.volume_retirado || 0;
    console.log('Somando retirada:', { id: retirada.id, volume });
    return total + volume;
  }, 0);

  // Calcular volume disponível (pode ser negativo se exceder o calculado)
  const volumeDisponivel = volumeTotal - volumeRetirado;

  console.log('useVolumeControl - Cálculos finais:', {
    volumeTotal,
    volumeRetirado,
    volumeDisponivel,
    retiradasCount: todasRetiradas.length
  });

  // Função para validar se pode retirar determinado volume
  // Sempre permitir retiradas, independente do volume disponível
  const podeRetirar = (volume: number): boolean => {
    return volume > 0; // Apenas verificar se é um valor positivo
  };

  // Calcular percentual utilizado (pode exceder 100%)
  const percentualUtilizado = volumeTotal > 0 ? (volumeRetirado / volumeTotal) * 100 : 0;

  return {
    volumeTotal,
    volumeRetirado,
    volumeDisponivel,
    podeRetirar,
    percentualUtilizado,
    permitirRetirada: true, // Sempre permitir retiradas
  };
};
