-- ============================================
-- Script SQL para criar a tabela de cadastros
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Criar tabela de cadastros
CREATE TABLE IF NOT EXISTS cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE cadastros ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções públicas (anon users)
-- Isso permite que usuários anônimos insiram dados no formulário
CREATE POLICY "Permitir inserção pública" ON cadastros
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Opcional: Política para permitir leitura (se necessário para admin)
-- Descomente se precisar ler os dados via API pública
-- CREATE POLICY "Permitir leitura pública" ON cadastros
--   FOR SELECT
--   TO anon
--   USING (true);

-- Criar índice no email para melhor performance
CREATE INDEX IF NOT EXISTS idx_cadastros_email ON cadastros(email);

-- Criar índice no created_at para consultas por data
CREATE INDEX IF NOT EXISTS idx_cadastros_created_at ON cadastros(created_at DESC);

