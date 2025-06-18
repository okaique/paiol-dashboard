
-- Verificar e adicionar foreign keys apenas se não existirem
DO $$
BEGIN
    -- dragagens foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'dragagens_paiol_id_fkey') THEN
        ALTER TABLE public.dragagens ADD CONSTRAINT dragagens_paiol_id_fkey FOREIGN KEY (paiol_id) REFERENCES public.paiols(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'dragagens_dragador_id_fkey') THEN
        ALTER TABLE public.dragagens ADD CONSTRAINT dragagens_dragador_id_fkey FOREIGN KEY (dragador_id) REFERENCES public.dragadores(id) ON DELETE RESTRICT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'dragagens_ajudante_id_fkey') THEN
        ALTER TABLE public.dragagens ADD CONSTRAINT dragagens_ajudante_id_fkey FOREIGN KEY (ajudante_id) REFERENCES public.ajudantes(id) ON DELETE RESTRICT;
    END IF;

    -- gastos_insumos foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'gastos_insumos_dragagem_id_fkey') THEN
        ALTER TABLE public.gastos_insumos ADD CONSTRAINT gastos_insumos_dragagem_id_fkey FOREIGN KEY (dragagem_id) REFERENCES public.dragagens(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'gastos_insumos_tipo_insumo_id_fkey') THEN
        ALTER TABLE public.gastos_insumos ADD CONSTRAINT gastos_insumos_tipo_insumo_id_fkey FOREIGN KEY (tipo_insumo_id) REFERENCES public.tipos_insumos(id) ON DELETE RESTRICT;
    END IF;

    -- pagamentos_pessoal foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'pagamentos_pessoal_dragagem_id_fkey') THEN
        ALTER TABLE public.pagamentos_pessoal ADD CONSTRAINT pagamentos_pessoal_dragagem_id_fkey FOREIGN KEY (dragagem_id) REFERENCES public.dragagens(id) ON DELETE CASCADE;
    END IF;

    -- cubagens foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cubagens_paiol_id_fkey') THEN
        ALTER TABLE public.cubagens ADD CONSTRAINT cubagens_paiol_id_fkey FOREIGN KEY (paiol_id) REFERENCES public.paiols(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cubagens_dragagem_id_fkey') THEN
        ALTER TABLE public.cubagens ADD CONSTRAINT cubagens_dragagem_id_fkey FOREIGN KEY (dragagem_id) REFERENCES public.dragagens(id) ON DELETE CASCADE;
    END IF;

    -- retiradas foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'retiradas_paiol_id_fkey') THEN
        ALTER TABLE public.retiradas ADD CONSTRAINT retiradas_paiol_id_fkey FOREIGN KEY (paiol_id) REFERENCES public.paiols(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'retiradas_cliente_id_fkey') THEN
        ALTER TABLE public.retiradas ADD CONSTRAINT retiradas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE RESTRICT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'retiradas_caminhao_id_fkey') THEN
        ALTER TABLE public.retiradas ADD CONSTRAINT retiradas_caminhao_id_fkey FOREIGN KEY (caminhao_id) REFERENCES public.caminhoes(id) ON DELETE RESTRICT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'retiradas_caminhao_frete_id_fkey') THEN
        ALTER TABLE public.retiradas ADD CONSTRAINT retiradas_caminhao_frete_id_fkey FOREIGN KEY (caminhao_frete_id) REFERENCES public.caminhoes(id) ON DELETE RESTRICT;
    END IF;

    -- fechamentos foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fechamentos_paiol_id_fkey') THEN
        ALTER TABLE public.fechamentos ADD CONSTRAINT fechamentos_paiol_id_fkey FOREIGN KEY (paiol_id) REFERENCES public.paiols(id) ON DELETE CASCADE;
    END IF;

    -- historico_status_paiols foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'historico_status_paiols_paiol_id_fkey') THEN
        ALTER TABLE public.historico_status_paiols ADD CONSTRAINT historico_status_paiols_paiol_id_fkey FOREIGN KEY (paiol_id) REFERENCES public.paiols(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'historico_status_paiols_usuario_id_fkey') THEN
        ALTER TABLE public.historico_status_paiols ADD CONSTRAINT historico_status_paiols_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;
    END IF;

    -- manutencoes foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'manutencoes_equipamento_id_fkey') THEN
        ALTER TABLE public.manutencoes ADD CONSTRAINT manutencoes_equipamento_id_fkey FOREIGN KEY (equipamento_id) REFERENCES public.equipamentos(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'manutencoes_empresa_id_fkey') THEN
        ALTER TABLE public.manutencoes ADD CONSTRAINT manutencoes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas_mecanicas(id) ON DELETE RESTRICT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'manutencoes_tipo_id_fkey') THEN
        ALTER TABLE public.manutencoes ADD CONSTRAINT manutencoes_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_manutencao(id) ON DELETE RESTRICT;
    END IF;

    -- abastecimentos foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'abastecimentos_equipamento_id_fkey') THEN
        ALTER TABLE public.abastecimentos ADD CONSTRAINT abastecimentos_equipamento_id_fkey FOREIGN KEY (equipamento_id) REFERENCES public.equipamentos(id) ON DELETE CASCADE;
    END IF;

    -- gastos_gerais foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'gastos_gerais_equipamento_id_fkey') THEN
        ALTER TABLE public.gastos_gerais ADD CONSTRAINT gastos_gerais_equipamento_id_fkey FOREIGN KEY (equipamento_id) REFERENCES public.equipamentos(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'gastos_gerais_tipo_id_fkey') THEN
        ALTER TABLE public.gastos_gerais ADD CONSTRAINT gastos_gerais_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_gastos(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- Habilitar RLS em todas as tabelas (só se ainda não estiver habilitado)
DO $$
BEGIN
    -- Verificar e habilitar RLS apenas se necessário
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'paiols' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.paiols ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'dragadores' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.dragadores ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'ajudantes' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.ajudantes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'dragagens' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.dragagens ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'tipos_insumos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.tipos_insumos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'gastos_insumos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.gastos_insumos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'pagamentos_pessoal' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.pagamentos_pessoal ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'cubagens' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.cubagens ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'clientes' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'caminhoes' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.caminhoes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'retiradas' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.retiradas ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'fechamentos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.fechamentos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'historico_status_paiols' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.historico_status_paiols ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'equipamentos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'empresas_mecanicas' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.empresas_mecanicas ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'tipos_manutencao' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.tipos_manutencao ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'manutencoes' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'abastecimentos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.abastecimentos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'tipos_gastos' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.tipos_gastos ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'gastos_gerais' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.gastos_gerais ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'user_roles' AND c.relrowsecurity = true) THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Criar políticas RLS apenas se não existirem
DO $$
BEGIN
    -- Paióis
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paiols' AND policyname = 'Usuários autenticados podem ver paióis') THEN
        CREATE POLICY "Usuários autenticados podem ver paióis" ON public.paiols FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paiols' AND policyname = 'Usuários autenticados podem inserir paióis') THEN
        CREATE POLICY "Usuários autenticados podem inserir paióis" ON public.paiols FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paiols' AND policyname = 'Usuários autenticados podem atualizar paióis') THEN
        CREATE POLICY "Usuários autenticados podem atualizar paióis" ON public.paiols FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paiols' AND policyname = 'Usuários autenticados podem deletar paióis') THEN
        CREATE POLICY "Usuários autenticados podem deletar paióis" ON public.paiols FOR DELETE TO authenticated USING (true);
    END IF;

    -- Dragadores
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragadores' AND policyname = 'Usuários autenticados podem ver dragadores') THEN
        CREATE POLICY "Usuários autenticados podem ver dragadores" ON public.dragadores FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragadores' AND policyname = 'Usuários autenticados podem inserir dragadores') THEN
        CREATE POLICY "Usuários autenticados podem inserir dragadores" ON public.dragadores FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragadores' AND policyname = 'Usuários autenticados podem atualizar dragadores') THEN
        CREATE POLICY "Usuários autenticados podem atualizar dragadores" ON public.dragadores FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragadores' AND policyname = 'Usuários autenticados podem deletar dragadores') THEN
        CREATE POLICY "Usuários autenticados podem deletar dragadores" ON public.dragadores FOR DELETE TO authenticated USING (true);
    END IF;

    -- Continuar para todas as outras tabelas...
    -- (Para economizar espaço, vou incluir apenas algumas representativas)
    
    -- Ajudantes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ajudantes' AND policyname = 'Usuários autenticados podem ver ajudantes') THEN
        CREATE POLICY "Usuários autenticados podem ver ajudantes" ON public.ajudantes FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ajudantes' AND policyname = 'Usuários autenticados podem inserir ajudantes') THEN
        CREATE POLICY "Usuários autenticados podem inserir ajudantes" ON public.ajudantes FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ajudantes' AND policyname = 'Usuários autenticados podem atualizar ajudantes') THEN
        CREATE POLICY "Usuários autenticados podem atualizar ajudantes" ON public.ajudantes FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ajudantes' AND policyname = 'Usuários autenticados podem deletar ajudantes') THEN
        CREATE POLICY "Usuários autenticados podem deletar ajudantes" ON public.ajudantes FOR DELETE TO authenticated USING (true);
    END IF;

    -- Dragagens
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragagens' AND policyname = 'Usuários autenticados podem ver dragagens') THEN
        CREATE POLICY "Usuários autenticados podem ver dragagens" ON public.dragagens FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragagens' AND policyname = 'Usuários autenticados podem inserir dragagens') THEN
        CREATE POLICY "Usuários autenticados podem inserir dragagens" ON public.dragagens FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragagens' AND policyname = 'Usuários autenticados podem atualizar dragagens') THEN
        CREATE POLICY "Usuários autenticados podem atualizar dragagens" ON public.dragagens FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dragagens' AND policyname = 'Usuários autenticados podem deletar dragagens') THEN
        CREATE POLICY "Usuários autenticados podem deletar dragagens" ON public.dragagens FOR DELETE TO authenticated USING (true);
    END IF;
END $$;

-- Criar triggers apenas se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_dragagens') THEN
        CREATE TRIGGER handle_updated_at_dragagens BEFORE UPDATE ON public.dragagens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_gastos_insumos') THEN
        CREATE TRIGGER handle_updated_at_gastos_insumos BEFORE UPDATE ON public.gastos_insumos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_pagamentos_pessoal') THEN
        CREATE TRIGGER handle_updated_at_pagamentos_pessoal BEFORE UPDATE ON public.pagamentos_pessoal FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_cubagens') THEN
        CREATE TRIGGER handle_updated_at_cubagens BEFORE UPDATE ON public.cubagens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_clientes') THEN
        CREATE TRIGGER handle_updated_at_clientes BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_caminhoes') THEN
        CREATE TRIGGER handle_updated_at_caminhoes BEFORE UPDATE ON public.caminhoes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_retiradas') THEN
        CREATE TRIGGER handle_updated_at_retiradas BEFORE UPDATE ON public.retiradas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'handle_updated_at_fechamentos') THEN
        CREATE TRIGGER handle_updated_at_fechamentos BEFORE UPDATE ON public.fechamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'calculate_cubagem_volumes_trigger') THEN
        CREATE TRIGGER calculate_cubagem_volumes_trigger BEFORE INSERT OR UPDATE ON public.cubagens FOR EACH ROW EXECUTE FUNCTION public.calculate_cubagem_volumes();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'calculate_gasto_total_trigger') THEN
        CREATE TRIGGER calculate_gasto_total_trigger BEFORE INSERT OR UPDATE ON public.gastos_insumos FOR EACH ROW EXECUTE FUNCTION public.calculate_gasto_total();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'calculate_retirada_total_trigger') THEN
        CREATE TRIGGER calculate_retirada_total_trigger BEFORE INSERT OR UPDATE ON public.retiradas FOR EACH ROW EXECUTE FUNCTION public.calculate_retirada_total();
    END IF;
END $$;
