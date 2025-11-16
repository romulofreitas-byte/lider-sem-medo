-- ============================================
-- Script SQL CORRIGIDO - Pode executar mesmo se já existir
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Criar tabela de cadastros (se não existir)
CREATE TABLE IF NOT EXISTS cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE cadastros ENABLE ROW LEVEL SECURITY;

-- Remover política existente se houver (ignora erro se não existir)
DROP POLICY IF EXISTS "Permitir inserção pública" ON cadastros;

-- Criar política para permitir inserções públicas (anon users)
CREATE POLICY "Permitir inserção pública" ON cadastros
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_cadastros_email ON cadastros(email);
CREATE INDEX IF NOT EXISTS idx_cadastros_created_at ON cadastros(created_at DESC);

