
-- Criar tabela de manutenções
CREATE TABLE public.manutencoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL REFERENCES public.equipamentos(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES public.empresas_mecanicas(id) ON DELETE RESTRICT,
  tipo_id UUID NOT NULL REFERENCES public.tipos_manutencao(id) ON DELETE RESTRICT,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  responsavel TEXT,
  observacoes TEXT,
  anexos TEXT[], -- Array de URLs dos anexos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela manutenções
ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para manutenções
CREATE POLICY "Usuários autenticados podem ver manutenções" 
  ON public.manutencoes 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar manutenções" 
  ON public.manutencoes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar manutenções" 
  ON public.manutencoes 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem excluir manutenções" 
  ON public.manutencoes 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_manutencoes
  BEFORE UPDATE ON public.manutencoes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_manutencoes_equipamento_id ON public.manutencoes(equipamento_id);
CREATE INDEX idx_manutencoes_empresa_id ON public.manutencoes(empresa_id);
CREATE INDEX idx_manutencoes_tipo_id ON public.manutencoes(tipo_id);
CREATE INDEX idx_manutencoes_data ON public.manutencoes(data);
