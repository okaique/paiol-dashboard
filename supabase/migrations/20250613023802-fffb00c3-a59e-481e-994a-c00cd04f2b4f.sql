
-- Criar tabela para cubagem dos paióis
CREATE TABLE public.cubagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paiol_id UUID NOT NULL REFERENCES public.paiols(id) ON DELETE CASCADE,
  dragagem_id UUID NOT NULL REFERENCES public.dragagens(id) ON DELETE CASCADE,
  medida_inferior DECIMAL(10,3) NOT NULL,
  medida_superior DECIMAL(10,3) NOT NULL,
  perimetro DECIMAL(10,3) NOT NULL,
  volume_normal DECIMAL(12,3) NOT NULL DEFAULT 0,
  volume_reduzido DECIMAL(12,3) NOT NULL DEFAULT 0,
  data_cubagem TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(dragagem_id) -- Cada dragagem pode ter apenas uma cubagem
);

-- Adicionar trigger para atualizar updated_at
CREATE TRIGGER handle_updated_at_cubagens BEFORE UPDATE ON public.cubagens
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Função para calcular volumes automaticamente
CREATE OR REPLACE FUNCTION public.calculate_cubagem_volumes()
RETURNS TRIGGER AS $$
BEGIN
  -- Fórmula para volume normal: (medida_inferior + medida_superior) / 2 * perímetro
  NEW.volume_normal = ((NEW.medida_inferior + NEW.medida_superior) / 2) * NEW.perimetro;
  
  -- Fórmula para volume reduzido: volume_normal * 0.85 (considerando 15% de perda)
  NEW.volume_reduzido = NEW.volume_normal * 0.85;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular volumes automaticamente
CREATE TRIGGER calculate_cubagem_volumes_trigger
  BEFORE INSERT OR UPDATE ON public.cubagens
  FOR EACH ROW EXECUTE FUNCTION public.calculate_cubagem_volumes();
