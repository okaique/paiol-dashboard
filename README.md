# Sistema de Gerenciamento de Paióis

Sistema completo para gerenciamento de paióis de areia lavada, controle de inventário, dragagens, retiradas, gastos, manutenções, pessoal e clientes.

## Funcionalidades Principais

- **Gestão de Paióis:** Cadastro, edição, controle de status (vazio, dragando, cheio, retirando), histórico de ciclos e timeline.
- **Dragagens:** Registro de dragagens, controle de pessoal (dragador/ajudante), insumos e pagamentos.
- **Retiradas:** Controle de retiradas de areia, clientes, caminhões, frete e status de pagamento.
- **Cubagem:** Registro e cálculo automático de volumes (normal, reduzido, perdas).
- **Gastos Gerais:** Cadastro de tipos de gastos, registro de gastos por equipamento, anexos e relatórios.
- **Manutenções e Abastecimentos:** Controle de manutenções, empresas mecânicas, tipos de manutenção e abastecimentos de equipamentos.
- **Pessoal:** Cadastro e gerenciamento de dragadores e ajudantes.
- **Clientes e Caminhões:** Cadastro de clientes e caminhões, histórico de retiradas.
- **Relatórios:** Relatórios de custos, volumes, manutenções e relatórios finais de dragagem.
- **Controle de Usuários:** Perfis, papéis (administrador, operador, visualizador), permissões e gerenciamento de usuários.
- **Segurança:** Row Level Security (RLS) no banco, autenticação via Supabase.

## Tecnologias Utilizadas

- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, Radix UI, React Query, React Router DOM, Lucide Icons.
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Functions, RLS).
- **Outros:** Zod, date-fns, Embla Carousel, Recharts.

## Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento Vite.
- `build`: Gera o build de produção.
- `preview`: Visualiza o build de produção localmente.
- `lint`: Executa o linter.
- `build:dev`: Build em modo desenvolvimento.

## Estrutura de Pastas

- `src/` — Código-fonte React/TypeScript.
- `src/pages/` — Páginas principais do sistema.
- `src/components/` — Componentes reutilizáveis.
- `src/types/` — Tipos TypeScript para entidades do sistema.
- `supabase/migrations/` — Scripts SQL para estrutura do banco.
- `public/` — Arquivos estáticos.

## Licença

Este projeto é privado e de uso exclusivo do cliente.

## Contato

Dúvidas ou suporte: [kaiqueoliveira257@gmail.com](mailto:kaiqueoliveira257@gmail.com)

---
Sistema desenvolvido por [Kaique Oliveira](mailto:kaiqueoliveira257@gmail.com)
