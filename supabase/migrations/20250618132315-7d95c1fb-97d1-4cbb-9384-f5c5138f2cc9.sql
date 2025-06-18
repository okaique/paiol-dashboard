
-- Completar políticas RLS para todas as tabelas restantes
DO $$
BEGIN
    -- Tipos de Insumos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_insumos' AND policyname = 'Usuários autenticados podem ver tipos de insumos') THEN
        CREATE POLICY "Usuários autenticados podem ver tipos de insumos" ON public.tipos_insumos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_insumos' AND policyname = 'Usuários autenticados podem inserir tipos de insumos') THEN
        CREATE POLICY "Usuários autenticados podem inserir tipos de insumos" ON public.tipos_insumos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_insumos' AND policyname = 'Usuários autenticados podem atualizar tipos de insumos') THEN
        CREATE POLICY "Usuários autenticados podem atualizar tipos de insumos" ON public.tipos_insumos FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_insumos' AND policyname = 'Usuários autenticados podem deletar tipos de insumos') THEN
        CREATE POLICY "Usuários autenticados podem deletar tipos de insumos" ON public.tipos_insumos FOR DELETE TO authenticated USING (true);
    END IF;

    -- Gastos Insumos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_insumos' AND policyname = 'Usuários autenticados podem ver gastos insumos') THEN
        CREATE POLICY "Usuários autenticados podem ver gastos insumos" ON public.gastos_insumos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_insumos' AND policyname = 'Usuários autenticados podem inserir gastos insumos') THEN
        CREATE POLICY "Usuários autenticados podem inserir gastos insumos" ON public.gastos_insumos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_insumos' AND policyname = 'Usuários autenticados podem atualizar gastos insumos') THEN
        CREATE POLICY "Usuários autenticados podem atualizar gastos insumos" ON public.gastos_insumos FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_insumos' AND policyname = 'Usuários autenticados podem deletar gastos insumos') THEN
        CREATE POLICY "Usuários autenticados podem deletar gastos insumos" ON public.gastos_insumos FOR DELETE TO authenticated USING (true);
    END IF;

    -- Pagamentos Pessoal
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pagamentos_pessoal' AND policyname = 'Usuários autenticados podem ver pagamentos pessoal') THEN
        CREATE POLICY "Usuários autenticados podem ver pagamentos pessoal" ON public.pagamentos_pessoal FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pagamentos_pessoal' AND policyname = 'Usuários autenticados podem inserir pagamentos pessoal') THEN
        CREATE POLICY "Usuários autenticados podem inserir pagamentos pessoal" ON public.pagamentos_pessoal FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pagamentos_pessoal' AND policyname = 'Usuários autenticados podem atualizar pagamentos pessoal') THEN
        CREATE POLICY "Usuários autenticados podem atualizar pagamentos pessoal" ON public.pagamentos_pessoal FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pagamentos_pessoal' AND policyname = 'Usuários autenticados podem deletar pagamentos pessoal') THEN
        CREATE POLICY "Usuários autenticados podem deletar pagamentos pessoal" ON public.pagamentos_pessoal FOR DELETE TO authenticated USING (true);
    END IF;

    -- Cubagens
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cubagens' AND policyname = 'Usuários autenticados podem ver cubagens') THEN
        CREATE POLICY "Usuários autenticados podem ver cubagens" ON public.cubagens FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cubagens' AND policyname = 'Usuários autenticados podem inserir cubagens') THEN
        CREATE POLICY "Usuários autenticados podem inserir cubagens" ON public.cubagens FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cubagens' AND policyname = 'Usuários autenticados podem atualizar cubagens') THEN
        CREATE POLICY "Usuários autenticados podem atualizar cubagens" ON public.cubagens FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cubagens' AND policyname = 'Usuários autenticados podem deletar cubagens') THEN
        CREATE POLICY "Usuários autenticados podem deletar cubagens" ON public.cubagens FOR DELETE TO authenticated USING (true);
    END IF;

    -- Clientes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários autenticados podem ver clientes') THEN
        CREATE POLICY "Usuários autenticados podem ver clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários autenticados podem inserir clientes') THEN
        CREATE POLICY "Usuários autenticados podem inserir clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários autenticados podem atualizar clientes') THEN
        CREATE POLICY "Usuários autenticados podem atualizar clientes" ON public.clientes FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários autenticados podem deletar clientes') THEN
        CREATE POLICY "Usuários autenticados podem deletar clientes" ON public.clientes FOR DELETE TO authenticated USING (true);
    END IF;

    -- Caminhões
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caminhoes' AND policyname = 'Usuários autenticados podem ver caminhões') THEN
        CREATE POLICY "Usuários autenticados podem ver caminhões" ON public.caminhoes FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caminhoes' AND policyname = 'Usuários autenticados podem inserir caminhões') THEN
        CREATE POLICY "Usuários autenticados podem inserir caminhões" ON public.caminhoes FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caminhoes' AND policyname = 'Usuários autenticados podem atualizar caminhões') THEN
        CREATE POLICY "Usuários autenticados podem atualizar caminhões" ON public.caminhoes FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caminhoes' AND policyname = 'Usuários autenticados podem deletar caminhões') THEN
        CREATE POLICY "Usuários autenticados podem deletar caminhões" ON public.caminhoes FOR DELETE TO authenticated USING (true);
    END IF;

    -- Retiradas
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retiradas' AND policyname = 'Usuários autenticados podem ver retiradas') THEN
        CREATE POLICY "Usuários autenticados podem ver retiradas" ON public.retiradas FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retiradas' AND policyname = 'Usuários autenticados podem inserir retiradas') THEN
        CREATE POLICY "Usuários autenticados podem inserir retiradas" ON public.retiradas FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retiradas' AND policyname = 'Usuários autenticados podem atualizar retiradas') THEN
        CREATE POLICY "Usuários autenticados podem atualizar retiradas" ON public.retiradas FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'retiradas' AND policyname = 'Usuários autenticados podem deletar retiradas') THEN
        CREATE POLICY "Usuários autenticados podem deletar retiradas" ON public.retiradas FOR DELETE TO authenticated USING (true);
    END IF;

    -- Fechamentos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fechamentos' AND policyname = 'Usuários autenticados podem ver fechamentos') THEN
        CREATE POLICY "Usuários autenticados podem ver fechamentos" ON public.fechamentos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fechamentos' AND policyname = 'Usuários autenticados podem inserir fechamentos') THEN
        CREATE POLICY "Usuários autenticados podem inserir fechamentos" ON public.fechamentos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    -- Histórico Status Paióis
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'historico_status_paiols' AND policyname = 'Usuários autenticados podem ver histórico') THEN
        CREATE POLICY "Usuários autenticados podem ver histórico" ON public.historico_status_paiols FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'historico_status_paiols' AND policyname = 'Usuários autenticados podem inserir histórico') THEN
        CREATE POLICY "Usuários autenticados podem inserir histórico" ON public.historico_status_paiols FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    -- Equipamentos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipamentos' AND policyname = 'Usuários autenticados podem ver equipamentos') THEN
        CREATE POLICY "Usuários autenticados podem ver equipamentos" ON public.equipamentos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipamentos' AND policyname = 'Usuários autenticados podem inserir equipamentos') THEN
        CREATE POLICY "Usuários autenticados podem inserir equipamentos" ON public.equipamentos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipamentos' AND policyname = 'Usuários autenticados podem atualizar equipamentos') THEN
        CREATE POLICY "Usuários autenticados podem atualizar equipamentos" ON public.equipamentos FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipamentos' AND policyname = 'Usuários autenticados podem deletar equipamentos') THEN
        CREATE POLICY "Usuários autenticados podem deletar equipamentos" ON public.equipamentos FOR DELETE TO authenticated USING (true);
    END IF;

    -- Empresas Mecânicas
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'empresas_mecanicas' AND policyname = 'Usuários autenticados podem ver empresas mecânicas') THEN
        CREATE POLICY "Usuários autenticados podem ver empresas mecânicas" ON public.empresas_mecanicas FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'empresas_mecanicas' AND policyname = 'Usuários autenticados podem inserir empresas mecânicas') THEN
        CREATE POLICY "Usuários autenticados podem inserir empresas mecânicas" ON public.empresas_mecanicas FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'empresas_mecanicas' AND policyname = 'Usuários autenticados podem atualizar empresas mecânicas') THEN
        CREATE POLICY "Usuários autenticados podem atualizar empresas mecânicas" ON public.empresas_mecanicas FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'empresas_mecanicas' AND policyname = 'Usuários autenticados podem deletar empresas mecânicas') THEN
        CREATE POLICY "Usuários autenticados podem deletar empresas mecânicas" ON public.empresas_mecanicas FOR DELETE TO authenticated USING (true);
    END IF;

    -- Tipos Manutenção
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_manutencao' AND policyname = 'Usuários autenticados podem ver tipos manutenção') THEN
        CREATE POLICY "Usuários autenticados podem ver tipos manutenção" ON public.tipos_manutencao FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_manutencao' AND policyname = 'Usuários autenticados podem inserir tipos manutenção') THEN
        CREATE POLICY "Usuários autenticados podem inserir tipos manutenção" ON public.tipos_manutencao FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_manutencao' AND policyname = 'Usuários autenticados podem atualizar tipos manutenção') THEN
        CREATE POLICY "Usuários autenticados podem atualizar tipos manutenção" ON public.tipos_manutencao FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_manutencao' AND policyname = 'Usuários autenticados podem deletar tipos manutenção') THEN
        CREATE POLICY "Usuários autenticados podem deletar tipos manutenção" ON public.tipos_manutencao FOR DELETE TO authenticated USING (true);
    END IF;

    -- Manutenções
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manutencoes' AND policyname = 'Usuários autenticados podem ver manutenções') THEN
        CREATE POLICY "Usuários autenticados podem ver manutenções" ON public.manutencoes FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manutencoes' AND policyname = 'Usuários autenticados podem inserir manutenções') THEN
        CREATE POLICY "Usuários autenticados podem inserir manutenções" ON public.manutencoes FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manutencoes' AND policyname = 'Usuários autenticados podem atualizar manutenções') THEN
        CREATE POLICY "Usuários autenticados podem atualizar manutenções" ON public.manutencoes FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'manutencoes' AND policyname = 'Usuários autenticados podem deletar manutenções') THEN
        CREATE POLICY "Usuários autenticados podem deletar manutenções" ON public.manutencoes FOR DELETE TO authenticated USING (true);
    END IF;

    -- Abastecimentos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'abastecimentos' AND policyname = 'Usuários autenticados podem ver abastecimentos') THEN
        CREATE POLICY "Usuários autenticados podem ver abastecimentos" ON public.abastecimentos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'abastecimentos' AND policyname = 'Usuários autenticados podem inserir abastecimentos') THEN
        CREATE POLICY "Usuários autenticados podem inserir abastecimentos" ON public.abastecimentos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'abastecimentos' AND policyname = 'Usuários autenticados podem atualizar abastecimentos') THEN
        CREATE POLICY "Usuários autenticados podem atualizar abastecimentos" ON public.abastecimentos FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'abastecimentos' AND policyname = 'Usuários autenticados podem deletar abastecimentos') THEN
        CREATE POLICY "Usuários autenticados podem deletar abastecimentos" ON public.abastecimentos FOR DELETE TO authenticated USING (true);
    END IF;

    -- Tipos Gastos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_gastos' AND policyname = 'Usuários autenticados podem ver tipos gastos') THEN
        CREATE POLICY "Usuários autenticados podem ver tipos gastos" ON public.tipos_gastos FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_gastos' AND policyname = 'Usuários autenticados podem inserir tipos gastos') THEN
        CREATE POLICY "Usuários autenticados podem inserir tipos gastos" ON public.tipos_gastos FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_gastos' AND policyname = 'Usuários autenticados podem atualizar tipos gastos') THEN
        CREATE POLICY "Usuários autenticados podem atualizar tipos gastos" ON public.tipos_gastos FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_gastos' AND policyname = 'Usuários autenticados podem deletar tipos gastos') THEN
        CREATE POLICY "Usuários autenticados podem deletar tipos gastos" ON public.tipos_gastos FOR DELETE TO authenticated USING (true);
    END IF;

    -- Gastos Gerais
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_gerais' AND policyname = 'Usuários autenticados podem ver gastos gerais') THEN
        CREATE POLICY "Usuários autenticados podem ver gastos gerais" ON public.gastos_gerais FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_gerais' AND policyname = 'Usuários autenticados podem inserir gastos gerais') THEN
        CREATE POLICY "Usuários autenticados podem inserir gastos gerais" ON public.gastos_gerais FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_gerais' AND policyname = 'Usuários autenticados podem atualizar gastos gerais') THEN
        CREATE POLICY "Usuários autenticados podem atualizar gastos gerais" ON public.gastos_gerais FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gastos_gerais' AND policyname = 'Usuários autenticados podem deletar gastos gerais') THEN
        CREATE POLICY "Usuários autenticados podem deletar gastos gerais" ON public.gastos_gerais FOR DELETE TO authenticated USING (true);
    END IF;

    -- User Roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Usuários autenticados podem ver roles') THEN
        CREATE POLICY "Usuários autenticados podem ver roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Usuários autenticados podem inserir roles') THEN
        CREATE POLICY "Usuários autenticados podem inserir roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Usuários autenticados podem atualizar roles') THEN
        CREATE POLICY "Usuários autenticados podem atualizar roles" ON public.user_roles FOR UPDATE TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Usuários autenticados podem deletar roles') THEN
        CREATE POLICY "Usuários autenticados podem deletar roles" ON public.user_roles FOR DELETE TO authenticated USING (true);
    END IF;
END $$;
