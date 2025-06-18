
-- Atualizar função para calcular volume normal como cilindro
CREATE OR REPLACE FUNCTION public.calculate_cubagem_volumes()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular raio a partir do perímetro (perímetro = 2 * pi * r, então r = perímetro / (2 * pi))
  DECLARE
    raio DECIMAL(10,3);
  BEGIN
    raio = NEW.perimetro / (2 * PI());
    
    -- Fórmula para volume normal: ((medida_inferior + medida_superior) / 2) * (pi * r²) - Volume do cilindro
    NEW.volume_normal = ((NEW.medida_inferior + NEW.medida_superior) / 2) * (PI() * POWER(raio, 2));
    
    -- Volume reduzido não é mais calculado automaticamente, será inserido manualmente
    -- Apenas garantir que não seja NULL se não fornecido
    IF NEW.volume_reduzido IS NULL THEN
      NEW.volume_reduzido = 0;
    END IF;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;
