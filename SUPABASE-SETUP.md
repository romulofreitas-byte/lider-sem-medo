# Configuração do Supabase

## Passo 1: Criar a tabela no Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase-setup.sql`
6. Clique em **Run** para executar o script

## Passo 2: Verificar a configuração

Após criar a tabela, verifique se:

- ✅ A tabela `cadastros` foi criada
- ✅ Row Level Security (RLS) está habilitado
- ✅ A política de inserção pública está ativa
- ✅ Os índices foram criados

## Estrutura da tabela

A tabela `cadastros` possui as seguintes colunas:

- `id` (UUID) - Chave primária, gerada automaticamente
- `nome` (TEXT) - Nome completo do cadastrado
- `email` (TEXT) - E-mail único (não permite duplicatas)
- `cargo` (TEXT) - Cargo/função do cadastrado
- `created_at` (TIMESTAMP) - Data/hora do cadastro, gerada automaticamente

## Testando a integração

1. Abra o site no navegador
2. Preencha o formulário de cadastro
3. Envie o formulário
4. Verifique no Supabase (tabela `cadastros`) se o registro foi criado

## Troubleshooting

### Erro: "relation 'cadastros' does not exist"
- Execute o script SQL no Supabase para criar a tabela

### Erro: "new row violates row-level security policy"
- Verifique se a política de inserção pública está criada e ativa
- Verifique se RLS está habilitado na tabela

### Erro: "duplicate key value violates unique constraint"
- O e-mail já está cadastrado (comportamento esperado)
- O formulário exibirá uma mensagem de erro apropriada

### Erro: "Biblioteca Supabase não carregada"
- Verifique sua conexão com a internet
- Verifique se o CDN do Supabase está acessível
- Verifique o console do navegador para erros de carregamento

