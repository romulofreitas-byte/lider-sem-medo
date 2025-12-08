# Configuração do Webhook do Asaas

## 📋 Visão Geral

Este projeto recebe webhooks do Asaas através de uma função serverless no Vercel. Os webhooks são processados e salvos no Supabase.

## 🚀 Passo 1: Criar Tabela no Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase-pagamentos-setup.sql`
6. Clique em **Run** para executar o script

### Verificar se a tabela foi criada:

```sql
SELECT * FROM pagamentos LIMIT 5;
```

## 🔐 Passo 2: Configurar Variáveis de Ambiente no Vercel

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione o projeto `lider-sem-medo`
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

### Variáveis Obrigatórias:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `SUPABASE_URL` | `https://riqslkibmvyalnwrapnj.supabase.co` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Service Role Key (bypassa RLS) |

**⚠️ IMPORTANTE:** Use a **Service Role Key**, não a Anon Key. A Service Role Key permite que a função serverless insira dados mesmo com RLS habilitado.

### Como obter a Service Role Key:

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie a **service_role** key (não a anon key)
3. Cole no Vercel como `SUPABASE_SERVICE_ROLE_KEY`

## 🔗 Passo 3: Configurar Webhook no Asaas

1. Acesse o [Dashboard do Asaas](https://www.asaas.com)
2. Vá em **Configurações** → **Webhooks**
3. Configure o webhook com:
   - **URL:** `https://lider-sem-medo.vercel.app/thankyou`
   - **Eventos:** Selecione os eventos que deseja receber (ex: `PAYMENT_CREATED`, `PAYMENT_CONFIRMED`)
   - **Versão da API:** `v3`
   - **Ativo:** Sim

## 📊 Estrutura da Tabela `pagamentos`

A tabela armazena todos os dados do webhook, incluindo:

- **Dados do evento:** `event_id`, `event_type`, `webhook_received_at`
- **Dados do pagamento:** `payment_id`, `customer_id`, `value`, `status`
- **Informações de cartão:** `credit_card_number`, `credit_card_brand`
- **URLs:** `invoice_url`, `transaction_receipt_url`
- **Dados completos:** `raw_data` (JSON completo do webhook)

## 🧪 Testar o Webhook

### 1. Verificar se a função está funcionando:

```bash
curl -X POST https://lider-sem-medo.vercel.app/thankyou \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Deve retornar um erro 400 (dados inválidos), mas confirma que o endpoint está ativo.

### 2. Verificar logs no Vercel:

1. Vá em **Deployments** → Selecione o último deployment
2. Clique em **Functions** → `api/thankyou.js`
3. Veja os logs em tempo real

### 3. Verificar dados no Supabase:

```sql
-- Ver últimos pagamentos recebidos
SELECT 
  payment_id,
  event_type,
  status,
  value,
  customer_id,
  webhook_received_at
FROM pagamentos
ORDER BY webhook_received_at DESC
LIMIT 10;
```

## 🔍 Troubleshooting

### Erro 405 (Method Not Allowed)

- ✅ Verifique se o arquivo `api/thankyou.js` existe
- ✅ Verifique se está fazendo POST (não GET)
- ✅ Faça um novo deploy no Vercel

### Erro ao salvar no Supabase

- ✅ Verifique se a tabela `pagamentos` foi criada
- ✅ Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada corretamente
- ✅ Verifique se a Service Role Key tem permissões (deve ter)

### Webhook não está sendo recebido

- ✅ Verifique os logs no Vercel
- ✅ Verifique se a URL do webhook está correta no Asaas
- ✅ Teste manualmente com curl (veja acima)

### Dados duplicados

- ✅ A tabela tem constraint `UNIQUE` em `payment_id`
- ✅ Se o mesmo webhook for enviado duas vezes, a segunda inserção falhará silenciosamente (idempotência)

## 📝 Eventos do Asaas

Os principais eventos que você pode receber:

- `PAYMENT_CREATED` - Pagamento criado
- `PAYMENT_CONFIRMED` - Pagamento confirmado
- `PAYMENT_RECEIVED` - Pagamento recebido
- `PAYMENT_OVERDUE` - Pagamento vencido
- `PAYMENT_DELETED` - Pagamento deletado

Configure no Asaas quais eventos deseja receber.

## 🔒 Segurança

- ✅ A função valida a estrutura dos dados recebidos
- ✅ Usa Service Role Key (não exposta no frontend)
- ✅ Retorna sempre 200 para evitar retentativas (mas loga erros)
- ✅ RLS habilitado na tabela (mas bypassado pela service role)

## 📚 Referências

- [Documentação do Asaas - Webhooks](https://docs.asaas.com/docs/webhooks)
- [Documentação do Vercel - Serverless Functions](https://vercel.com/docs/functions)
- [Documentação do Supabase - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

