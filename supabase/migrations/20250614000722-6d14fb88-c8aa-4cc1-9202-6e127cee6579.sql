
-- Criar enum para os papéis de usuários
CREATE TYPE public.app_role AS ENUM ('administrador', 'operador', 'visualizador');

-- Criar tabela de papéis de usuários
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'visualizador',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar se um usuário tem um papel específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Função para obter o papel de maior nível de um usuário
CREATE OR REPLACE FUNCTION public.get_user_highest_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role 
      WHEN 'administrador' THEN 1
      WHEN 'operador' THEN 2
      WHEN 'visualizador' THEN 3
    END 
  LIMIT 1;
$$;

-- Políticas RLS para user_roles
-- Administradores podem ver todos os papéis
CREATE POLICY "Administradores podem ver todos os papéis"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'administrador'));

-- Usuários podem ver seus próprios papéis
CREATE POLICY "Usuários podem ver seus próprios papéis"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Apenas administradores podem inserir/atualizar papéis
CREATE POLICY "Apenas administradores podem gerenciar papéis"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'administrador'))
WITH CHECK (public.has_role(auth.uid(), 'administrador'));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_user_roles_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_roles_updated_at();

-- Atribuir papel de administrador ao primeiro usuário (você)
-- Substitua o UUID abaixo pelo seu ID de usuário real
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
  id, 
  'administrador'::app_role, 
  NOW()
FROM auth.users 
ORDER BY created_at ASC 
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- Função para listar todos os usuários com seus papéis (apenas para administradores)
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  nome TEXT,
  role app_role,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    u.id as user_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'nome', u.email) as nome,
    COALESCE(ur.role, 'visualizador'::app_role) as role,
    ur.assigned_at,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'administrador')
  ORDER BY u.created_at;
$$;
