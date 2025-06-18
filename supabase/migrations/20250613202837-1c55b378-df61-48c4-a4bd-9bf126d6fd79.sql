
-- Criar tabela de equipamentos
CREATE TABLE public.equipamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modelo TEXT NOT NULL,
  placa TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela equipamentos
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados verem todos os equipamentos
CREATE POLICY "Usuários autenticados podem ver equipamentos" 
  ON public.equipamentos 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para usuários autenticados criarem equipamentos
CREATE POLICY "Usuários autenticados podem criar equipamentos" 
  ON public.equipamentos 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política para usuários autenticados atualizarem equipamentos
CREATE POLICY "Usuários autenticados podem atualizar equipamentos" 
  ON public.equipamentos 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Política para usuários autenticados excluírem equipamentos
CREATE POLICY "Usuários autenticados podem excluir equipamentos" 
  ON public.equipamentos 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_equipamentos
  BEFORE UPDATE ON public.equipamentos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
