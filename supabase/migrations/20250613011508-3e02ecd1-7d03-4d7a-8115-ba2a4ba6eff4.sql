
-- Criar tabela de usuários (perfis)
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cargo TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de paióis
CREATE TABLE public.paiols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL CHECK (localizacao IN ('Sede', 'Neném')),
  status TEXT NOT NULL DEFAULT 'VAZIO' CHECK (status IN ('VAZIO', 'DRAGANDO', 'CHEIO', 'RETIRANDO')),
  data_abertura TIMESTAMP WITH TIME ZONE,
  data_fechamento TIMESTAMP WITH TIME ZONE,
  ciclo_atual INTEGER DEFAULT 1,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de dragadores
CREATE TABLE public.dragadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  endereco TEXT,
  valor_diaria DECIMAL(10,2),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de ajudantes
CREATE TABLE public.ajudantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  endereco TEXT,
  valor_diaria DECIMAL(10,2),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de histórico de status dos paióis
CREATE TABLE public.historico_status_paiols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paiol_id UUID NOT NULL REFERENCES public.paiols(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  data_mudanca TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  observacoes TEXT,
  usuario_id UUID REFERENCES public.usuarios(id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dragadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ajudantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_status_paiols ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuários
CREATE POLICY "Usuários podem ver todos os perfis" ON public.usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.usuarios FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir próprio perfil" ON public.usuarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Políticas RLS para paióis
CREATE POLICY "Usuários podem ver paióis" ON public.paiols FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem inserir paióis" ON public.paiols FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar paióis" ON public.paiols FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Usuários podem deletar paióis" ON public.paiols FOR DELETE TO authenticated USING (true);

-- Políticas RLS para dragadores
CREATE POLICY "Usuários podem ver dragadores" ON public.dragadores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem inserir dragadores" ON public.dragadores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar dragadores" ON public.dragadores FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Usuários podem deletar dragadores" ON public.dragadores FOR DELETE TO authenticated USING (true);

-- Políticas RLS para ajudantes
CREATE POLICY "Usuários podem ver ajudantes" ON public.ajudantes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem inserir ajudantes" ON public.ajudantes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar ajudantes" ON public.ajudantes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Usuários podem deletar ajudantes" ON public.ajudantes FOR DELETE TO authenticated USING (true);

-- Políticas RLS para histórico
CREATE POLICY "Usuários podem ver histórico" ON public.historico_status_paiols FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários podem inserir histórico" ON public.historico_status_paiols FOR INSERT TO authenticated WITH CHECK (true);

-- Inserir dados iniciais dos 6 paióis
INSERT INTO public.paiols (nome, localizacao, status) VALUES
('Paiol 1', 'Sede', 'VAZIO'),
('Paiol 2', 'Sede', 'VAZIO'),
('Paiol 3', 'Sede', 'VAZIO'),
('Paiol 4', 'Neném', 'VAZIO'),
('Paiol 5', 'Neném', 'VAZIO'),
('Paiol 6', 'Neném', 'VAZIO');

-- Função para automatizar criação de perfil de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'nome', new.email), new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_paiols BEFORE UPDATE ON public.paiols FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_dragadores BEFORE UPDATE ON public.dragadores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at_ajudantes BEFORE UPDATE ON public.ajudantes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
