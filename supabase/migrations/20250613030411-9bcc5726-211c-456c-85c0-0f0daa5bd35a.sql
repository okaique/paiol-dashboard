
-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT,
  tipo_pessoa TEXT NOT NULL DEFAULT 'FISICA' CHECK (tipo_pessoa IN ('FISICA', 'JURIDICA')),
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de caminhões
CREATE TABLE public.caminhoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placa TEXT NOT NULL UNIQUE,
  modelo TEXT,
  marca TEXT,
  ano INTEGER,
  capacidade_m3 NUMERIC,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de retiradas
CREATE TABLE public.retiradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paiol_id UUID NOT NULL REFERENCES public.paiols(id),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  caminhao_id UUID REFERENCES public.caminhoes(id),
  data_retirada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  volume_retirado NUMERIC NOT NULL,
  valor_unitario NUMERIC,
  valor_total NUMERIC,
  motorista_nome TEXT,
  motorista_cpf TEXT,
  placa_informada TEXT,
  tem_frete BOOLEAN NOT NULL DEFAULT false,
  valor_frete NUMERIC,
  caminhao_frete_id UUID REFERENCES public.caminhoes(id),
  status_pagamento TEXT NOT NULL DEFAULT 'NAO_PAGO' CHECK (status_pagamento IN ('PAGO', 'NAO_PAGO')),
  data_pagamento TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para calcular valor total automaticamente
CREATE OR REPLACE FUNCTION public.calculate_retirada_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_total = NEW.volume_retirado * COALESCE(NEW.valor_unitario, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_retirada_total
  BEFORE INSERT OR UPDATE ON public.retiradas
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_retirada_total();

-- Trigger para updated_at em todas as tabelas
CREATE TRIGGER trigger_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_caminhoes_updated_at
  BEFORE UPDATE ON public.caminhoes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_retiradas_updated_at
  BEFORE UPDATE ON public.retiradas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Índices para performance
CREATE INDEX idx_retiradas_paiol_id ON public.retiradas(paiol_id);
CREATE INDEX idx_retiradas_cliente_id ON public.retiradas(cliente_id);
CREATE INDEX idx_retiradas_data_retirada ON public.retiradas(data_retirada);
CREATE INDEX idx_clientes_cpf_cnpj ON public.clientes(cpf_cnpj);
CREATE INDEX idx_caminhoes_placa ON public.caminhoes(placa);

-- Comentários para documentação
COMMENT ON TABLE public.clientes IS 'Cadastro de clientes que retiram areia dos paióis';
COMMENT ON TABLE public.caminhoes IS 'Cadastro de caminhões utilizados para transporte';
COMMENT ON TABLE public.retiradas IS 'Registro de retiradas de areia dos paióls';
COMMENT ON COLUMN public.clientes.tipo_pessoa IS 'Tipo de pessoa: FISICA ou JURIDICA';
COMMENT ON COLUMN public.retiradas.tem_frete IS 'Indica se a retirada inclui serviço de frete';
COMMENT ON COLUMN public.retiradas.status_pagamento IS 'Status do pagamento: PAGO ou NAO_PAGO';
