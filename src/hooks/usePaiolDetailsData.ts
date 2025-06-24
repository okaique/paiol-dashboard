
import { usePaiols } from '@/hooks/usePaiols';
import { useDragagemAtiva, useDragagemMaisRecente } from '@/hooks/useDragagens';
import { useCubagemPorDragagem } from '@/hooks/useCubagens';
import { useDragadores } from '@/hooks/useDragadores';
import { useAjudantes } from '@/hooks/useAjudantes';
import { useVolumeControl } from '@/hooks/useVolumeControl';

export const usePaiolDetailsData = (paiolId: string) => {
  const { data: paiols, isLoading } = usePaiols();
  const { data: dragadores } = useDragadores();
  const { data: ajudantes } = useAjudantes();

  const paiol = paiols?.find(p => p.id === paiolId);
  const { data: dragagemAtiva } = useDragagemAtiva(paiolId);
  const { data: dragagemMaisRecente } = useDragagemMaisRecente(paiolId);
  
  // Para cubagem, usamos a dragagem mais recente se não houver dragagem ativa
  const dragagemParaCubagem = dragagemAtiva || dragagemMaisRecente;
  const { data: cubagem } = useCubagemPorDragagem(dragagemParaCubagem?.id || '');
  
  // Only call useVolumeControl if paiol exists
  const volumeControl = useVolumeControl(paiol?.id || '', dragagemParaCubagem?.id);

  // Buscar informações do pessoal da dragagem
  const dragador = dragadores?.find(d => d.id === dragagemParaCubagem?.dragador_id);
  const ajudante = ajudantes?.find(a => a.id === dragagemParaCubagem?.ajudante_id);

  return {
    paiol,
    isLoading,
    dragagemAtiva,
    dragagemMaisRecente,
    dragagemParaCubagem,
    cubagem,
    volumeControl,
    dragador,
    ajudante
  };
};
