-- ============================================
-- SCRIPT DE VERIFICAÇÃO - Execute para diagnosticar problemas
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Verificar se a tabela existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cadastros')
        THEN '✅ Tabela cadastros existe'
        ELSE '❌ Tabela cadastros NÃO existe'
    END AS status_tabela;

-- Verificar se RLS está habilitado
SELECT 
    CASE 
        WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'cadastros' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
        THEN '✅ RLS está HABILITADO'
        ELSE '❌ RLS está DESABILITADO'
    END AS status_rls;

-- Verificar políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'cadastros'
ORDER BY policyname;

-- Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'cadastros'
ORDER BY ordinal_position;

-- Contar registros existentes
SELECT COUNT(*) as total_registros FROM public.cadastros;

-- Testar inserção manual (descomente para testar)
-- INSERT INTO public.cadastros (nome, email, cargo) 
-- VALUES ('Teste Manual', 'teste-manual@exemplo.com', 'Teste')
-- RETURNING *;

