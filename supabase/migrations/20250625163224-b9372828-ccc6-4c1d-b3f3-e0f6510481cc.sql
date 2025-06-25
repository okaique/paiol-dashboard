
-- Corrigir a função calculate_cubagem_volumes para preservar o volume_reduzido
-- e calcular corretamente o volume_normal usando a fórmula do cilindro
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
    
    -- IMPORTANTE: O volume_reduzido é SEMPRE preservado como foi inserido
    -- Não fazemos NENHUM cálculo ou alteração no volume_reduzido
    -- Se o usuário digitou 1500, permanece 1500
    -- Se o usuário digitou 142, permanece 142
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;
