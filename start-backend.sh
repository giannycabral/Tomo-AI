#!/bin/bash

echo "=== Iniciando o Tomo-AI Backend ==="

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "Error: Node.js não encontrado! Por favor, instale o Node.js primeiro."
    exit 1
fi

# Navega para a pasta backend
cd backend

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

# Verifica se existe arquivo .env
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo "Nota: Você pode configurar sua chave API Gemini no arquivo backend/.env OU diretamente na interface do usuário."
    echo "      A configuração pela interface é recomendada pois não salva a chave em nenhum arquivo."
fi

# Inicia o servidor
echo "Iniciando o servidor Tomo-AI..."
npm start
