
-- Criar tabela de abastecimentos
CREATE TABLE public.abastecimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL REFERENCES public.equipamentos(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  litragem NUMERIC(10,2) NOT NULL DEFAULT 0,
  km_atual NUMERIC(10,2),
  responsavel TEXT,
  observacoes TEXT,
  anexos TEXT[], -- Array de URLs dos anexos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela abastecimentos
ALTER TABLE public.abastecimentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para abastecimentos
CREATE POLICY "Usuários autenticados podem ver abastecimentos" 
  ON public.abastecimentos 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar abastecimentos" 
  ON public.abastecimentos 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar abastecimentos" 
  ON public.abastecimentos 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem excluir abastecimentos" 
  ON public.abastecimentos 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_abastecimentos
  BEFORE UPDATE ON public.abastecimentos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_abastecimentos_equipamento_id ON public.abastecimentos(equipamento_id);
CREATE INDEX idx_abastecimentos_data ON public.abastecimentos(data);
