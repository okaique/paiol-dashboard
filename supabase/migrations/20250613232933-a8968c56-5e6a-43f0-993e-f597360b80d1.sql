
-- Criar tabela para tipos de gastos gerais
CREATE TABLE public.tipos_gastos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para gastos gerais
CREATE TABLE public.gastos_gerais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL REFERENCES public.equipamentos(id) ON DELETE CASCADE,
  tipo_id UUID NOT NULL REFERENCES public.tipos_gastos(id),
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valor NUMERIC(10,2) NOT NULL,
  responsavel TEXT,
  observacoes TEXT,
  anexos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar triggers para atualizar updated_at
CREATE TRIGGER handle_updated_at_tipos_gastos BEFORE UPDATE ON public.tipos_gastos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_gastos_gerais BEFORE UPDATE ON public.gastos_gerais
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Inserir alguns tipos de gastos padrão
INSERT INTO public.tipos_gastos (nome) VALUES
('Combustível'),
('Pedágio'),
('Alimentação'),
('Hospedagem'),
('Material de Limpeza'),
('Peças de Reposição'),
('Ferramentas'),
('Outros');
