
-- Verificar paióis que deveriam estar com status DRAGANDO
-- e corrigir inconsistências no banco de dados

-- 1. Atualizar paióis que têm dragagem ativa mas não estão com status DRAGANDO
UPDATE public.paiols 
SET status = 'DRAGANDO' 
WHERE id IN (
  SELECT DISTINCT paiol_id 
  FROM public.dragagens 
  WHERE data_fim IS NULL
) AND status != 'DRAGANDO';

-- 2. Corrigir a função execute_status_transition para garantir ordem correta
CREATE OR REPLACE FUNCTION public.execute_status_transition(
  p_paiol_id uuid, 
  p_new_status text, 
  p_dragador_id uuid DEFAULT NULL::uuid, 
  p_ajudante_id uuid DEFAULT NULL::uuid, 
  p_observacoes text DEFAULT NULL::text, 
  p_usuario_id uuid DEFAULT NULL::uuid
) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  current_status TEXT;
  transition_valid BOOLEAN;
BEGIN
  -- Buscar status atual
  SELECT status INTO current_status FROM public.paiols WHERE id = p_paiol_id;
  
  -- Validar transição
  SELECT public.validate_status_transition(p_paiol_id, p_new_status, p_dragador_id, p_ajudante_id) 
  INTO transition_valid;
  
  IF NOT transition_valid THEN
    RAISE EXCEPTION 'Transição inválida de % para %', current_status, p_new_status;
  END IF;
  
  -- PRIMEIRO: Atualizar status do paiol
  UPDATE public.paiols SET status = p_new_status WHERE id = p_paiol_id;
  
  -- DEPOIS: Executar ações específicas para cada transição
  IF current_status = 'VAZIO' AND p_new_status = 'DRAGANDO' THEN
    -- Registrar início da dragagem
    INSERT INTO public.dragagens (paiol_id, dragador_id, ajudante_id, observacoes)
    VALUES (p_paiol_id, p_dragador_id, p_ajudante_id, p_observacoes);
    
    -- Atualizar data de abertura do paiol
    UPDATE public.paiols SET data_abertura = now() WHERE id = p_paiol_id;
    
  ELSIF current_status = 'DRAGANDO' AND p_new_status = 'CHEIO' THEN
    -- Finalizar dragagem
    UPDATE public.dragagens 
    SET data_fim = now(), observacoes = COALESCE(p_observacoes, observacoes)
    WHERE paiol_id = p_paiol_id AND data_fim IS NULL;
    
  ELSIF current_status = 'RETIRANDO' AND p_new_status = 'VAZIO' THEN
    -- Registrar fechamento
    INSERT INTO public.fechamentos (paiol_id, observacoes)
    VALUES (p_paiol_id, p_observacoes);
    
    -- Atualizar data de fechamento e incrementar ciclo
    UPDATE public.paiols 
    SET data_fechamento = now(), 
        ciclo_atual = ciclo_atual + 1
    WHERE id = p_paiol_id;
  END IF;
  
  -- Registrar no histórico
  INSERT INTO public.historico_status_paiols (paiol_id, status_anterior, status_novo, observacoes, usuario_id)
  VALUES (p_paiol_id, current_status, p_new_status, p_observacoes, p_usuario_id);
  
  RETURN true;
END;
$$;

-- 3. Melhorar o trigger para garantir consistência
CREATE OR REPLACE FUNCTION public.sync_paiol_status_with_dragagem()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando uma nova dragagem é inserida
  IF TG_OP = 'INSERT' THEN
    UPDATE public.paiols 
    SET status = 'DRAGANDO' 
    WHERE id = NEW.paiol_id AND status = 'VAZIO';
    RETURN NEW;
  END IF;
  
  -- Quando uma dragagem é finalizada
  IF TG_OP = 'UPDATE' AND OLD.data_fim IS NULL AND NEW.data_fim IS NOT NULL THEN
    UPDATE public.paiols 
    SET status = 'CHEIO' 
    WHERE id = NEW.paiol_id AND status = 'DRAGANDO';
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar os triggers
DROP TRIGGER IF EXISTS trigger_sync_paiol_status_insert ON public.dragagens;
DROP TRIGGER IF EXISTS trigger_sync_paiol_status_update ON public.dragagens;
DROP TRIGGER IF EXISTS trigger_update_paiol_status_on_dragagem_insert ON public.dragagens;
DROP TRIGGER IF EXISTS trigger_update_paiol_status_on_dragagem_change ON public.dragagens;

CREATE TRIGGER trigger_sync_paiol_status_insert
  AFTER INSERT ON public.dragagens
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_paiol_status_with_dragagem();

CREATE TRIGGER trigger_sync_paiol_status_update
  AFTER UPDATE ON public.dragagens
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_paiol_status_with_dragagem();
