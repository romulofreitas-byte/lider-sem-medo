@echo off
REM Script de deploy para Vercel (Windows)

echo 🚀 Iniciando deploy para Vercel...

REM Verificar se está logado
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Você precisa fazer login no Vercel primeiro.
    echo Execute: vercel login
    exit /b 1
)

REM Vincular ao projeto (se ainda não estiver vinculado)
if not exist ".vercel\project.json" (
    echo 📎 Vinculando ao projeto...
    vercel link --project prj_AFnojWprqnDXrxeBVn7J7KXynzRr --yes
)

REM Fazer deploy em produção
echo 📦 Fazendo deploy em produção...
vercel --prod --yes

echo ✅ Deploy concluído!


