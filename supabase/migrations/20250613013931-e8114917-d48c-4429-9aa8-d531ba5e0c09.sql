
-- Criar tabela para registrar dragagens
CREATE TABLE public.dragagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paiol_id UUID NOT NULL REFERENCES public.paiols(id),
  dragador_id UUID NOT NULL REFERENCES public.dragadores(id),
  ajudante_id UUID REFERENCES public.ajudantes(id),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fim TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para registrar fechamentos/retiradas
CREATE TABLE public.fechamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paiol_id UUID NOT NULL REFERENCES public.paiols(id),
  data_fechamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar trigger para atualizar updated_at nas novas tabelas
CREATE TRIGGER handle_updated_at_dragagens BEFORE UPDATE ON public.dragagens
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_fechamentos BEFORE UPDATE ON public.fechamentos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Criar função para validar transições de status
CREATE OR REPLACE FUNCTION public.validate_status_transition(
  p_paiol_id UUID,
  p_new_status TEXT,
  p_dragador_id UUID DEFAULT NULL,
  p_ajudante_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  current_status TEXT;
  valid_transition BOOLEAN := false;
BEGIN
  -- Buscar status atual
  SELECT status INTO current_status FROM public.paiols WHERE id = p_paiol_id;
  
  -- Validar transições permitidas
  CASE current_status
    WHEN 'VAZIO' THEN
      IF p_new_status = 'DRAGANDO' AND p_dragador_id IS NOT NULL THEN
        valid_transition := true;
      END IF;
    WHEN 'DRAGANDO' THEN
      IF p_new_status = 'CHEIO' THEN
        valid_transition := true;
      END IF;
    WHEN 'CHEIO' THEN
      IF p_new_status = 'RETIRANDO' THEN
        valid_transition := true;
      END IF;
    WHEN 'RETIRANDO' THEN
      IF p_new_status = 'VAZIO' THEN
        valid_transition := true;
      END IF;
  END CASE;
  
  RETURN valid_transition;
END;
$$;

-- Criar função para executar transição de status
CREATE OR REPLACE FUNCTION public.execute_status_transition(
  p_paiol_id UUID,
  p_new_status TEXT,
  p_dragador_id UUID DEFAULT NULL,
  p_ajudante_id UUID DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL,
  p_usuario_id UUID DEFAULT NULL
) RETURNS BOOLEAN
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
  
  -- Executar ações específicas para cada transição
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
  
  -- Atualizar status do paiol
  UPDATE public.paiols SET status = p_new_status WHERE id = p_paiol_id;
  
  -- Registrar no histórico
  INSERT INTO public.historico_status_paiols (paiol_id, status_anterior, status_novo, observacoes, usuario_id)
  VALUES (p_paiol_id, current_status, p_new_status, p_observacoes, p_usuario_id);
  
  RETURN true;
END;
$$;
