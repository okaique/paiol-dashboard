
-- Limpar todos os dados de teste do banco de dados
-- Mantendo apenas usuários e estruturas das tabelas

-- Desabilitar verificações de chave estrangeira temporariamente
SET session_replication_role = replica;

-- Limpar dados das tabelas principais (em ordem para respeitar dependências)
DELETE FROM public.gastos_insumos;
DELETE FROM public.pagamentos_pessoal;
DELETE FROM public.cubagens;
DELETE FROM public.retiradas;
DELETE FROM public.gastos_gerais;
DELETE FROM public.manutencoes;
DELETE FROM public.abastecimentos;
DELETE FROM public.dragagens;
DELETE FROM public.fechamentos;
DELETE FROM public.historico_status_paiols;

-- Limpar dados de referência
DELETE FROM public.tipos_insumos;
DELETE FROM public.tipos_gastos;
DELETE FROM public.tipos_manutencao;
DELETE FROM public.empresas_mecanicas;
DELETE FROM public.equipamentos;
DELETE FROM public.caminhoes;
DELETE FROM public.clientes;
DELETE FROM public.ajudantes;
DELETE FROM public.dragadores;
DELETE FROM public.paiols;

-- Reabilitar verificações de chave estrangeira
SET session_replication_role = DEFAULT;

-- Resetar sequences para IDs começarem do 1 novamente (se houver)
-- Como usamos UUIDs, não há sequences para resetar

-- Inserir alguns tipos de insumos básicos para facilitar os testes
INSERT INTO public.tipos_insumos (nome, categoria, unidade_medida) VALUES
('Gasolina Comum', 'COMBUSTIVEL', 'LITRO'),
('Diesel S10', 'COMBUSTIVEL', 'LITRO'),
('Óleo Motor 15W40', 'OLEO', 'LITRO'),
('Óleo Hidráulico', 'OLEO', 'LITRO'),
('Filtro Combustível', 'FILTRO', 'UNIDADE'),
('Filtro Óleo', 'FILTRO', 'UNIDADE'),
('Graxa', 'LUBRIFICANTE', 'KG');

-- Inserir alguns tipos de gastos básicos
INSERT INTO public.tipos_gastos (nome) VALUES
('Combustível'),
('Manutenção'),
('Peças'),
('Serviços'),
('Outros');

-- Inserir alguns tipos de manutenção básicos
INSERT INTO public.tipos_manutencao (nome) VALUES
('Preventiva'),
('Corretiva'),
('Revisão'),
('Troca de Óleo'),
('Troca de Filtros');

-- Inserir os 6 paióis iniciais
INSERT INTO public.paiols (nome, localizacao, status) VALUES
('Paiol 1', 'Sede', 'VAZIO'),
('Paiol 2', 'Sede', 'VAZIO'),
('Paiol 3', 'Sede', 'VAZIO'),
('Paiol 4', 'Neném', 'VAZIO'),
('Paiol 5', 'Neném', 'VAZIO'),
('Paiol 6', 'Neném', 'VAZIO');
