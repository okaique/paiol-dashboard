
-- Criar tabela de empresas mecânicas
CREATE TABLE public.empresas_mecanicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  contato TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de tipos de manutenção
CREATE TABLE public.tipos_manutencao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para empresas_mecanicas
ALTER TABLE public.empresas_mecanicas ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS para tipos_manutencao
ALTER TABLE public.tipos_manutencao ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para empresas_mecanicas
CREATE POLICY "Permitir select para usuários autenticados" ON public.empresas_mecanicas
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Permitir insert para usuários autenticados" ON public.empresas_mecanicas
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados" ON public.empresas_mecanicas
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Permitir delete para usuários autenticados" ON public.empresas_mecanicas
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Criar políticas RLS para tipos_manutencao
CREATE POLICY "Permitir select para usuários autenticados" ON public.tipos_manutencao
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Permitir insert para usuários autenticados" ON public.tipos_manutencao
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados" ON public.tipos_manutencao
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Permitir delete para usuários autenticados" ON public.tipos_manutencao
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_empresas_mecanicas
  BEFORE UPDATE ON public.empresas_mecanicas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tipos_manutencao
  BEFORE UPDATE ON public.tipos_manutencao
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
