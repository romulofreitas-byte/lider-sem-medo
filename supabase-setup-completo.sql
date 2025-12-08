-- ============================================
-- SCRIPT SQL COMPLETO PARA SUPABASE
-- Execute este script no SQL Editor do Supabase
-- Este script garante que tudo esteja configurado corretamente
-- ============================================

-- 1. Criar tabela de cadastros (se não existir)
CREATE TABLE IF NOT EXISTS public.cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- 3. Remover política existente se houver (para evitar conflitos)
DROP POLICY IF EXISTS "Permitir inserção pública" ON public.cadastros;
DROP POLICY IF EXISTS "Permitir inserção anon" ON public.cadastros;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.cadastros;

-- 4. Criar política para permitir inserções públicas (anon users)
-- Esta política permite que usuários anônimos (sem autenticação) insiram dados
CREATE POLICY "Permitir inserção pública" 
ON public.cadastros
FOR INSERT 
TO anon
WITH CHECK (true);

-- 5. Criar política para permitir inserções de usuários autenticados também (opcional)
CREATE POLICY "Permitir inserção autenticada" 
ON public.cadastros
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 6. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cadastros_email ON public.cadastros(email);
CREATE INDEX IF NOT EXISTS idx_cadastros_created_at ON public.cadastros(created_at DESC);

-- 7. Verificar se tudo foi criado corretamente
DO $$
BEGIN
    RAISE NOTICE '✅ Tabela cadastros criada/verificada';
    RAISE NOTICE '✅ RLS habilitado';
    RAISE NOTICE '✅ Políticas de inserção criadas';
    RAISE NOTICE '✅ Índices criados';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Para testar, execute:';
    RAISE NOTICE 'INSERT INTO public.cadastros (nome, email, cargo) VALUES (''Teste'', ''teste@exemplo.com'', ''Teste'');';
END $$;

-- 8. TESTE: Inserir um registro de teste (descomente para testar)
-- INSERT INTO public.cadastros (nome, email, cargo) 
-- VALUES ('Teste', 'teste@exemplo.com', 'Teste');


