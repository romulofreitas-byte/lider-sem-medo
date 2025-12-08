#!/bin/bash
# Script de deploy para Vercel

echo "🚀 Iniciando deploy para Vercel..."

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Você precisa fazer login no Vercel primeiro."
    echo "Execute: vercel login"
    exit 1
fi

# Vincular ao projeto (se ainda não estiver vinculado)
if [ ! -f ".vercel/project.json" ]; then
    echo "📎 Vinculando ao projeto..."
    vercel link --project prj_AFnojWprqnDXrxeBVn7J7KXynzRr --yes
fi

# Fazer deploy em produção
echo "📦 Fazendo deploy em produção..."
vercel --prod --yes

echo "✅ Deploy concluído!"


