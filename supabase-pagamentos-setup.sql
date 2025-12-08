-- ============================================
-- SCRIPT SQL PARA CRIAR TABELA DE PAGAMENTOS
-- Execute este script no SQL Editor do Supabase
-- Tabela para armazenar webhooks do Asaas
-- ============================================

-- 1. Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do evento
  event_id TEXT,
  event_type TEXT NOT NULL,
  webhook_received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  webhook_date_created TIMESTAMP WITH TIME ZONE,
  
  -- Dados do pagamento
  payment_id TEXT NOT NULL UNIQUE,
  customer_id TEXT,
  installment_id TEXT,
  checkout_session TEXT,
  payment_link TEXT,
  
  -- Valores
  value NUMERIC(10, 2) DEFAULT 0,
  net_value NUMERIC(10, 2) DEFAULT 0,
  original_value NUMERIC(10, 2),
  interest_value NUMERIC(10, 2),
  
  -- Informações do pagamento
  description TEXT,
  billing_type TEXT,
  status TEXT NOT NULL,
  
  -- Datas
  confirmed_date DATE,
  due_date DATE,
  original_due_date DATE,
  payment_date DATE,
  client_payment_date DATE,
  credit_date DATE,
  estimated_credit_date DATE,
  
  -- Cartão de crédito (últimos 4 dígitos)
  credit_card_number TEXT,
  credit_card_brand TEXT,
  
  -- Parcelas
  installment_number INTEGER,
  
  -- URLs e referências
  invoice_url TEXT,
  invoice_number TEXT,
  transaction_receipt_url TEXT,
  bank_slip_url TEXT,
  nosso_numero TEXT,
  external_reference TEXT,
  
  -- Flags
  deleted BOOLEAN DEFAULT FALSE,
  anticipated BOOLEAN DEFAULT FALSE,
  anticipable BOOLEAN DEFAULT FALSE,
  
  -- Dados completos do webhook (JSON)
  raw_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir inserção via service role" ON public.pagamentos;
DROP POLICY IF EXISTS "Permitir leitura via service role" ON public.pagamentos;

-- 4. Criar política para permitir inserções via service role (serverless functions)
-- Service role bypassa RLS automaticamente, mas é bom ter a política explícita
CREATE POLICY "Permitir inserção via service role" 
ON public.pagamentos
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 5. Criar política para permitir leitura via service role
CREATE POLICY "Permitir leitura via service role" 
ON public.pagamentos
FOR SELECT 
TO service_role
USING (true);

-- 6. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_payment_id ON public.pagamentos(payment_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_customer_id ON public.pagamentos(customer_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON public.pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_event_type ON public.pagamentos(event_type);
CREATE INDEX IF NOT EXISTS idx_pagamentos_created_at ON public.pagamentos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pagamentos_payment_link ON public.pagamentos(payment_link);
CREATE INDEX IF NOT EXISTS idx_pagamentos_webhook_received_at ON public.pagamentos(webhook_received_at DESC);

-- 7. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_pagamentos_updated_at ON public.pagamentos;
CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON public.pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Comentários nas colunas (documentação)
COMMENT ON TABLE public.pagamentos IS 'Tabela para armazenar webhooks de pagamento do Asaas';
COMMENT ON COLUMN public.pagamentos.payment_id IS 'ID único do pagamento no Asaas (único)';
COMMENT ON COLUMN public.pagamentos.raw_data IS 'Dados completos do webhook em formato JSON';
COMMENT ON COLUMN public.pagamentos.status IS 'Status do pagamento: CONFIRMED, PENDING, RECEIVED, etc.';

-- 10. Verificar configuração
DO $$
BEGIN
    RAISE NOTICE '✅ Tabela pagamentos criada/verificada';
    RAISE NOTICE '✅ RLS habilitado';
    RAISE NOTICE '✅ Políticas criadas';
    RAISE NOTICE '✅ Índices criados';
    RAISE NOTICE '✅ Trigger de updated_at criado';
END $$;

