
-- Criar tabela para tipos de insumos
CREATE TABLE public.tipos_insumos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL, -- Ex: 'COMBUSTIVEL', 'OLEO', 'MANUTENCAO', etc.
  unidade_medida TEXT NOT NULL DEFAULT 'LITRO', -- LITRO, KG, UNIDADE, etc.
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para registrar gastos com insumos
CREATE TABLE public.gastos_insumos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dragagem_id UUID NOT NULL REFERENCES public.dragagens(id) ON DELETE CASCADE,
  tipo_insumo_id UUID NOT NULL REFERENCES public.tipos_insumos(id),
  quantidade DECIMAL(10,3) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_gasto TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fornecedor TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para pagamentos/adiantamentos de pessoal
CREATE TABLE public.pagamentos_pessoal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dragagem_id UUID NOT NULL REFERENCES public.dragagens(id) ON DELETE CASCADE,
  pessoa_id UUID NOT NULL,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('DRAGADOR', 'AJUDANTE')),
  tipo_pagamento TEXT NOT NULL DEFAULT 'ADIANTAMENTO' CHECK (tipo_pagamento IN ('ADIANTAMENTO', 'PAGAMENTO_FINAL')),
  valor DECIMAL(10,2) NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar triggers para atualizar updated_at
CREATE TRIGGER handle_updated_at_tipos_insumos BEFORE UPDATE ON public.tipos_insumos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_gastos_insumos BEFORE UPDATE ON public.gastos_insumos
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_pagamentos_pessoal BEFORE UPDATE ON public.pagamentos_pessoal
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Inserir alguns tipos de insumos padrão
INSERT INTO public.tipos_insumos (nome, categoria, unidade_medida) VALUES
('Gasolina Comum', 'COMBUSTIVEL', 'LITRO'),
('Diesel S10', 'COMBUSTIVEL', 'LITRO'),
('Óleo Motor 15W40', 'OLEO', 'LITRO'),
('Óleo Hidráulico', 'OLEO', 'LITRO'),
('Filtro Combustível', 'FILTRO', 'UNIDADE'),
('Filtro Óleo', 'FILTRO', 'UNIDADE'),
('Graxa', 'LUBRIFICANTE', 'KG');

-- Criar função para calcular valor total automaticamente
CREATE OR REPLACE FUNCTION public.calculate_gasto_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_total = NEW.quantidade * NEW.valor_unitario;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular valor total automaticamente
CREATE TRIGGER calculate_gasto_total_trigger
  BEFORE INSERT OR UPDATE ON public.gastos_insumos
  FOR EACH ROW EXECUTE FUNCTION public.calculate_gasto_total();
