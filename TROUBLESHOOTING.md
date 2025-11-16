# Troubleshooting - Dados não chegam no Supabase

## Passos para Diagnosticar

### 1. Verificar Console do Navegador

Abra o **Console do Desenvolvedor** (F12) e tente enviar o formulário. Procure por:

- ✅ `✅ Supabase disponível` - Supabase carregou corretamente
- ✅ `🔧 Criando cliente Supabase...` - Cliente sendo criado
- ✅ `📤 Enviando dados para Supabase:` - Dados sendo enviados
- ❌ Qualquer mensagem de erro em vermelho

### 2. Verificar Erros Comuns

#### Erro: "Biblioteca Supabase não carregada"
**Solução:**
- Recarregue a página (Ctrl+F5 para limpar cache)
- Verifique sua conexão com a internet
- Verifique se o CDN está acessível

#### Erro: "Tabela 'cadastros' não encontrada" (código 42P01)
**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o script `supabase-setup.sql`
4. Verifique se a tabela foi criada em **Table Editor**

#### Erro: "Permissão negada" (código 42501)
**Solução:**
1. No Supabase Dashboard, vá em **Authentication > Policies**
2. Selecione a tabela `cadastros`
3. Verifique se existe uma política chamada "Permitir inserção pública"
4. Se não existir, execute este SQL:

```sql
CREATE POLICY "Permitir inserção pública" ON cadastros
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

#### Erro: "new row violates row-level security policy"
**Solução:**
1. Verifique se RLS está habilitado: `ALTER TABLE cadastros ENABLE ROW LEVEL SECURITY;`
2. Verifique se a política de inserção existe e está ativa
3. Tente desabilitar temporariamente RLS para teste (não recomendado para produção):

```sql
ALTER TABLE cadastros DISABLE ROW LEVEL SECURITY;
```

### 3. Verificar Configuração da Tabela

No Supabase Dashboard:

1. **Table Editor** → Tabela `cadastros`
2. Verifique se as colunas existem:
   - `id` (UUID, Primary Key)
   - `nome` (Text)
   - `email` (Text, Unique)
   - `cargo` (Text)
   - `created_at` (Timestamp)

### 4. Testar Inserção Manual

No Supabase Dashboard, vá em **SQL Editor** e execute:

```sql
INSERT INTO cadastros (nome, email, cargo)
VALUES ('Teste', 'teste@exemplo.com', 'Teste');
```

Se funcionar, o problema está no código JavaScript.
Se não funcionar, o problema está na configuração do Supabase.

### 5. Verificar API Key

Certifique-se de que está usando a **anon key** (não a service_role key).

A anon key deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6. Verificar URL do Supabase

A URL deve estar no formato: `https://[seu-projeto].supabase.co`

## Checklist Rápido

- [ ] Tabela `cadastros` existe no Supabase
- [ ] Colunas estão corretas (nome, email, cargo)
- [ ] RLS está habilitado
- [ ] Política de inserção pública existe e está ativa
- [ ] API Key está correta (anon key)
- [ ] URL do Supabase está correta
- [ ] Console do navegador não mostra erros
- [ ] Supabase carregou corretamente (verificar console)

## Teste Completo

1. Abra o site no navegador
2. Abra o Console (F12)
3. Preencha o formulário
4. Envie o formulário
5. Observe as mensagens no console
6. Verifique se aparece `✅ Cadastro realizado com sucesso`
7. Verifique no Supabase se o registro apareceu

## Se Nada Funcionar

1. Copie todas as mensagens do console
2. Verifique os logs no Supabase Dashboard → Logs
3. Tente criar um registro manualmente no Supabase
4. Verifique se há erros de CORS no console

